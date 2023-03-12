# my-next-adventure

## TODO

### Closed Alpha

- [ ] Invites
- Use Invite table for Adventures invite.
- Adventure get invite will upsert invite (add default remainingUses and expireAt) (create new one if remaningUses or expireAt requires it).

- [ ] Magic email
- https://github.com/sergiodxa/remix-auth/blob/v2.6.0/docs/strategies/kcd.md
- https://www.mailing.run/ (dev?)
- https://www.mailgun.com/pricing/ (prod?)
- https://sendgrid.com/pricing/ (prod?)

- [ ] Review nomenclatures (adventure, challenge etc)
- - My Next Adventure (Adventure/Edition + Challenge)
- - I Dare You (Edition + Challenge)

- [ ] Create real adventures / challenges. Check GPT help.

- [ ] Set app theme

### Future

- [ ] App Internationalization
- - Check for packages and tools
- - Start with port and eng

- [ ] Adventure + Challenge Internationalization
- - Check for packages and tools (would it work?? or need to save in DB??)
- - Can only manage content from same language of app. How to show this in a nice way to user?
- - Idea: intermediate table with AdventureTemplate and ChallengeTemplate lang. Can only have challenges from same lang as adventure. When create the adventure, save data from the lang and save which lang it is.
- - Show lang in adventure listing and details.

- [ ] Can replace-delete current image? Save ID and get full url instead of full url?

- [ ] Reset password by email ?

### Maybe

- [ ] Set theme based on Adventure

- [ ] Add draft/published idea for templates

- [ ] Free adventures (not coupled to templates), get challenges on fly ?

- [ ] Invites ?
- Create no-auth/unauth needed route for adventure invites (/invites/adventure?invite=1234) and add share link copy:
- - If there is a searchParam invite, validate it in loader and if wrong, send to index page with notification about it. If valid, check user. If there isn't a invite param, generate form with only the invite input to be manually put and after clicking on "Join", run the same as it was in the searchParam.
- - - if user is auth, just try to join the adventure by using searchParam invite. Errors send to index with notification. Success redirect to adventure page.
- - - if user is not auth, send to login forwarding searchParam invite, which will redirect back to this page after login/register.
- Update join page to automatically inject invite from searchParam in an input. Check redirections and searchParam forwards. Idea is to manually add join code (main) or share join link with code (maybe?).
