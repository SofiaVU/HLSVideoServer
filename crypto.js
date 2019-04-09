import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';

export function digestPassword(password) {
    return sha256(password).toString(Hex);
}

