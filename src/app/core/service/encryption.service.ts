import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  //private ENCRYPT_SALT = 'fy@trip@001@kol';
  private key: string = 'fy@trip@001@kol'; // Replace with a secure 32-byte key
  private ivLength: number = 16;

  constructor() { }

  encryptText(plainText: string): string {
    // Use the salt to generate a 32-byte key
    // const key = CryptoJS.enc.Utf8.parse(this.ENCRYPT_SALT.padEnd(32).substring(0, 32));
    // const iv = CryptoJS.lib.WordArray.random(16); // Generate a random initialization vector (IV)

    // // Encrypt the plain text using AES with CBC mode
    // const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), key, {
    //   iv: iv,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7
    // });

    // // Combine IV and encrypted message, then convert to Base64
    // const combined = iv.concat(encrypted.ciphertext);
    // return CryptoJS.enc.Base64.stringify(combined);

    const keyBytes = CryptoJS.enc.Utf8.parse(this.key.padEnd(32, ' ').substring(0, 32));
    const iv = CryptoJS.lib.WordArray.random(this.ivLength);
    const timestamp: number = Math.floor(Date.now() / 1000); // Unix timestamp

    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), keyBytes, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert IV to bytes
    const ivHex = CryptoJS.enc.Hex.stringify(iv);
    const ivArray = new Uint8Array(
      ivHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );

    // Convert encrypted text to bytes
    const encryptedHex = CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
    const encryptedArray = new Uint8Array(
      encryptedHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );

    // Create timestamp array
    const timestampArray = new Uint8Array(8);
    new DataView(timestampArray.buffer).setUint32(4, timestamp, false);

    // Combine all arrays
    const finalArray = new Uint8Array(ivArray.length + timestampArray.length + encryptedArray.length);
    finalArray.set(ivArray, 0);
    finalArray.set(timestampArray, ivArray.length);
    finalArray.set(encryptedArray, ivArray.length + timestampArray.length);

    // Convert to base64
    return btoa(String.fromCharCode.apply(null, [...finalArray]));


  }

  encryptTextNormal(plainText: string): string {
    // Use the salt to generate a 32-byte key
    const key = CryptoJS.enc.Utf8.parse(this.key.padEnd(32).substring(0, 32));
    const iv = CryptoJS.lib.WordArray.random(16); // Generate a random initialization vector (IV)

    // Encrypt the plain text using AES with CBC mode
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Combine IV and encrypted message, then convert to Base64
    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);

  }
}
