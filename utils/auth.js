#!/usr/bin/node

import sha1 from 'sha1';


export pwdHashed(pwd) {
  return sha1(pwd);
}

export getAuthHeader(req) {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  return header;
};

export getToken(authHeader) {
  const tokenType = authHeader.substring(0, 6);
  if (tokenType !== 'Basic ') {
    return null;
  }
  return authHeader.substring(6);
};

export decodeToken(token) {
  const decodedToken = Buffer.from(token, 'base64').toString('utf8');
  if (!decodedToken.includes(':')) {
    return null;
  }
  return decodedToken;
};

export getCredentials(decodedToken) {
  const [email, password] = decodedToken.split(':');
  if (!email || !password) {
    return null;
  }
  return {email, password};
};
