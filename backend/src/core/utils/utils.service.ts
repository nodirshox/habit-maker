import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { PASSWORD_SALT } from '@/consts/password-salt'

@Injectable()
export class UtilsService {
  generateBcrypt = async (password: string) => {
    return bcrypt.hash(password, PASSWORD_SALT)
  }

  compareHash = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compareSync(password, hash)
  }
}
