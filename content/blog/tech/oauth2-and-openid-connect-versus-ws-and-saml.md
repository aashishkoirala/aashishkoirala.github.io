---
title: OAuth2 and OpenID Connect versus WS and SAML
slug: oauth2-and-openid-connect-versus-ws-and-saml
date: 2017-02-20
draft: false
tags:
- wsfed
- wstrust
- saml
- oauth2
- openidconnect
- security
---
I have mentioned how part of [our replatforming project]({{< ref "moving-to-azure-paas-and-service-fabric-part-1" >}}) that saw us move to Azure was moving the security protocol from [WS-Federation](https://en.wikipedia.org/wiki/WS-Federation)/[WS-Trust](https://en.wikipedia.org/wiki/WS-Trust) to [OAuth2](https://oauth.net/2/) and [OpenID Connect](https://openid.net/connect/). I kept running into rumblings on the internet about how even though it was widely adopted, OAuth2/OpenID Connect were somehow less secure. Comparing a secure implementation of both side by side, I did not really see how this could be. Since our industry is not short on oversimplification and grand proclamations, I decided to pose this question to experts in the field.

I posted [this question](https://security.stackexchange.com/questions/148292/why-is-oauth2-openid-connect-considered-less-secure-than-saml-ws) on the [Information Security Stack Exchange](https://security.stackexchange.com) site. The quality of the responses I got blew me away- carefully thought through and well articulated, to say the least.

I liked [this answer](https://security.stackexchange.com/a/148550/136270) by [Karl McGuinness](https://security.stackexchange.com/users/136522/karl-mcguinness) the best and thought it worthwhile to socialize it further through this blog post.

The key takeaway, though, is:

- All these protocols are secure, but an implementation may be insecure if not properly done. In this spirit, the simpler the protocol, the better.
- All these protocols use cryptographically signed tokens that support optional encryption.
- There are some problems with OAuth2 by itself which are addressed by OpenID Connect.

I hope this can serve as a good resource to refute any other oversimplified statement to the contrary.
