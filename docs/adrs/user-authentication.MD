# User Authentication

Contents:

- [Summary](#summary)
  - [Issue](#issue)
  - [Decision](#decision)
  - [Status](#status)
- [Details](#details)
  - [Assumptions](#assumptions)

## Summary

### Issue

I want the Limon boilerplate to include a basic auth service to exemplify, in a
simple way, how to guard endpoints. Auth implementation will vary from project
to project and can get quite complex. I would like to keep auth simple for now.

- To accomplish this, I considered firebase, auth0 and descope. All of which are
  great options with free tiers. I also considered rolling a simple jwt auth
  service using secure httpOnly cookies.

- httpOnly cookies seem to work well with ssr from my initial research but they
  do have limitations. They don't allow client-side js access to the cookie. For
  now I am fine with that, if the need arises I can split the header/signature
  and put them in an httpOnly cookie then pass the payload in a none httpOnly
  cookie to give client-side js access to the jwt payload, then reassemble on
  the server for validation.

### Decision

For simplicity and easy of use I have decided to use a simple jwt/secure cookie
solution that I will build myself. The decision comes from looking at my current
requirements. In the future I can always add separate modules for different auth
providers and migrate any users.

### Status

Decided. Open to considering to new capabilities as they come up.

## Details

### Assumptions

I assume each user will use and secure their own auth service.
