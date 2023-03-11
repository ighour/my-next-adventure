# my-next-adventure

## TODO

- [ ] Create real adventures / challenges. Check GPT help.

- [ ] Review nomenclatures (adventure, challenge etc)

- [ ] Magic email
- https://github.com/sergiodxa/remix-auth/blob/v2.6.0/docs/strategies/kcd.md
- https://www.mailing.run/ (dev?)
- https://www.mailgun.com/pricing/ (prod?)
- https://sendgrid.com/pricing/ (prod?)

- [ ] Invites
- Use one table for invites, can be relationed to Users or Adventures. Add type enum to it. Add optional remainingUses. Add optional expireAt.
- Change invite DB nomenclature to invite.
- Use friendly 8 digits invite (letters+numbers), and need to be unique (whe creating, try again if generated a existing one).
- Adventure get invite will upsert invite (add default remainingUses and expireAt) (create new one if remaningUses or expireAt requires it).
- Create no-auth/unauth needed route for adventure invites (/invites/adventure?invite=1234) and add share link copy:
- - If there is a searchParam invite, validate it in loader and if wrong, send to index page with notification about it. If valid, check user. If there isn't a invite param, generate form with only the invite input to be manually put and after clicking on "Join", run the same as it was in the searchParam.
- - - if user is auth, just try to join the adventure by using searchParam invite. Errors send to index with notification. Success redirect to adventure page.
- - - if user is not auth, send to login forwarding searchParam invite, which will redirect back to this page after login/register.
- Update join page to automatically inject invite from searchParam in an input. Check redirections and searchParam forwards. Idea is to manually add join code (main) or share join link with code (maybe?).

- [ ] Set app theme ?

- [ ] Set theme based on Adventure?

- [ ] Add draft/published idea for templates?

- [ ] Can replace-delete current image? Save ID and get full url instead of full url?

- [ ] Free adventures (not coupled to templates), get challenges on fly ?

- [ ] Reset password by email ?
