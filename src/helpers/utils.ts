import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Utility {

    async encryptPassword(password: string) {
        const salt = await bcrypt.genSalt(7);
        const hash = bcrypt.hash(password, salt);
        return hash;
    }

    async decryptPassword(compareTo: string, compareWith: string) {
        return await bcrypt.compare(compareTo, compareWith);
    }

    randomID() {
        const alpabets = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
        let random = '';
        for (let i = 0; i < 8; i++) {
            random += alpabets[Math.floor(Math.random() * 30 + i)]
        }

        return random;
    }
}