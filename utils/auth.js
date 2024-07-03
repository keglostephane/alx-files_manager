#!/usr/bin/node

import sha1 from 'sha1';


export default pwdHashed(pwd) {
  return sha1(pwd);
}

export default getAuthHeader(req) {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  return header;
};

export default getToken(authHeader) {
  const tokenType = authHeader.substring(0, 6);
  if (tokenType !== 'Basic ') {
    return null;
  }
  return authHeader.substring(6);
};

export default decodeToken(token) {
  const decodedToken = Buffer.from(token, 'base64').toString('utf8');
  if (!decodedToken.includes(':')) {
    return null;
  }
  return decodedToken;
};

export default getCredentials(decodedToken) {
  const [email, password] = decodedToken.split(':');
  if (!email || !password) {
    return null;
  }
  return {email, password};
};
