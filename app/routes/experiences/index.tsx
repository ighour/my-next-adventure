import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getCreatedAdventureListItems, getJoinedAdventureListItems } from "~/models/adventure.server";
import defaultCoverImage from "~/assets/adventure_cover.png";
import dayjs from "dayjs";

export async function loader({ request }: LoaderArgs) {
    const userId = await requireUserId(request);
    const createdAdventureListItems = await getCreatedAdventureListItems({ userId });
    const joinedAdventureListItems = await getJoinedAdventureListItems({ userId });
    return json({ createdAdventureListItems, joinedAdventureListItems });
}

export default function AdventuresIndexPage() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <div className="flex justify-center items-center">
                <Link
                    to="new"
                    className="m-2"
                >
                    <button className="btn btn-primary">Criar uma Experiência</button>
                </Link>
                <Link
                    to="join"
                    className="m-2"
                >
                    <button className="btn btn-primary">Participar de uma Experiência</button>
                </Link>
            </div>

            {data.createdAdventureListItems.length > 0 &&
                <div className="my-5">
                    <h2 className="text-2xl mb-2">Experiências Criadas</h2>
                    <div className="flex flex-wrap">
                        {data.createdAdventureListItems.map(adventure => {
                            const { newCount, activeCount, completedCount } = adventure.challenges.reduce((all, item) => {
                                if (!item.revealedAt) {
                                    return { ...all, newCount: all.newCount + 1 }
                                }
                                if (!item.completedAt) {
                                    return { ...all, activeCount: all.activeCount + 1 }
                                }
                                return { ...all, completedCount: all.completedCount + 1 }
                            }, { newCount: 0, activeCount: 0, completedCount: 0 })
                            const adventurersCount = adventure.joiners.length + 1;
                            return (
                                <div className="card w-72 h-72 m-3 overflow-hidden bg-base-100 shadow-xl image-full" key={adventure.id}>
                                    <figure><img src={adventure.coverImage ?? defaultCoverImage} alt="Shoes" /></figure>
                                    <div className="card-body">
                                        <div className="flex-1">
                                            <h2 className="card-title mb-2">{adventure.title}</h2>
                                            <ul className="my-2">
                                                <li>{dayjs(adventure.createdAt).format("YYYY-MM-DD")}</li>
                                                <li>{adventurersCount} aventureiros</li>
                                            </ul>
                                            {(newCount > 0 || activeCount > 0 || completedCount > 0) &&
                                                <ul className="my-2">
                                                    {newCount > 0 && <li>{newCount}x novos</li>}
                                                    {activeCount > 0 && <li>{activeCount}x ativos</li>}
                                                    {completedCount > 0 && <li>{completedCount}x finalizados</li>}
                                                </ul>
                                            }
                                        </div>
                                        <div className="card-actions justify-end">
                                            <Link
                                                to={adventure.id}
                                            >
                                                <button className="btn btn-ghost">Abrir</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }

            {data.joinedAdventureListItems.length > 0 &&
                <div className="my-5">
                    <h2 className="text-2xl mb-2">Experiências Compartilhadas</h2>
                    <div className="flex flex-wrap">
                        {data.joinedAdventureListItems.map(adventure => {
                            const { newCount, activeCount, completedCount } = adventure.challenges.reduce((all, item) => {
                                if (!item.revealedAt) {
                                    return { ...all, newCount: all.newCount + 1 }
                                }
                                if (!item.completedAt) {
                                    return { ...all, activeCount: all.activeCount + 1 }
                                }
                                return { ...all, completedCount: all.completedCount + 1 }
                            }, { newCount: 0, activeCount: 0, completedCount: 0 })
                            const adventurersCount = adventure.joiners.length + 1;
                            return (
                                <div className="card w-72 h-72 m-3 overflow-hidden bg-base-100 shadow-xl image-full" key={adventure.id}>
                                    <figure><img src={adventure.coverImage ?? defaultCoverImage} alt="Shoes" /></figure>
                                    <div className="card-body">
                                        <div className="flex-1">
                                            <h2 className="card-title mb-2">{adventure.title}</h2>
                                            <ul className="my-2">
                                                <li>{dayjs(adventure.createdAt).format("YYYY-MM-DD")}</li>
                                                <li>{adventurersCount} aventureiros</li>
                                            </ul>
                                            {(newCount > 0 || activeCount > 0 || completedCount > 0) &&
                                                <ul className="my-2">
                                                    {newCount > 0 && <li>{newCount}x novos</li>}
                                                    {activeCount > 0 && <li>{activeCount}x ativos</li>}
                                                    {completedCount > 0 && <li>{completedCount}x finalizados</li>}
                                                </ul>
                                            }
                                        </div>
                                        <div className="card-actions justify-end">
                                            <Link
                                                to={adventure.id}
                                            >
                                                <button className="btn btn-ghost">Abrir</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    );
}
