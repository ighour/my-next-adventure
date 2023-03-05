import type { ActionArgs } from "@remix-run/node";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUserId } from "~/session.server";

import type { UploadApiResponse } from "cloudinary";
import cloudinary from "cloudinary";
import { composeUploadHandlers, parseMultipartFormData } from "@remix-run/server-runtime/dist/formData";
import { createMemoryUploadHandler } from "@remix-run/server-runtime/dist/upload/memoryUploadHandler";
import { addCompletedImage } from "~/models/challenge.server";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @TODO - how to catch errors and return properly?
async function uploadImageToCloudinary(
    data: AsyncIterable<Uint8Array>
) {
    return new Promise<UploadApiResponse>(
        async (resolve, reject) => {
            const uploadStream =
                cloudinary.v2.uploader.upload_stream(
                    {
                        folder: process.env.CLOUDINARY_FOLDER,
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        if (!result) {
                            reject(result);
                            return;
                        }
                        resolve(result);
                    }
                );
            await writeAsyncIterableToWritable(
                data,
                uploadStream
            );
        }
    );
}

export async function action({ request }: ActionArgs) {
    const userId = await requireUserId(request);

    const uploadHandler = composeUploadHandlers(
        // our custom upload handler
        async ({ name, contentType, data, filename }) => {
            if (name !== "image") {
                return undefined;
            }
            const uploadedImage = await uploadImageToCloudinary(
                data
            );
            return uploadedImage.secure_url;
        },
        // fallback to memory for everything else
        createMemoryUploadHandler()
    );

    const formData = await parseMultipartFormData(
        request,
        uploadHandler
    );

    const _challengeId = formData.get("_challengeId")
    const imageUrl = formData.get("image");

    if (!_challengeId) {
        return json(
            { errors: { _challengeId, completedImage: "Missing challenge ID" } },
            { status: 400 }
        );
    }

    if (!imageUrl) {
        return json(
            { errors: { _challengeId, completedImage: "Invalid image" } },
            { status: 400 }
        );
    }

    await addCompletedImage({ id: _challengeId?.toString(), userId, completedImage: imageUrl.toString() });

    return null

}
