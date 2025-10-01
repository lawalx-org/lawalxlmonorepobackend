// src/utils/otp.util.ts
export function generateOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}


// utils/mask.util.ts
export function maskPhone(phone: string): string {
  if (!phone) return '';
  // keep first 4 and last 4 digits, mask middle with *
  return phone.replace(/(\d{4})\d+(\d{4})/, '$1****$2');
}

export function maskEmail(email: string): string {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;

  const visibleUser = user.slice(0, 3); // show first 3 chars
  const hidden = '*'.repeat(Math.max(user.length - 3, 3));
  return `${visibleUser}${hidden}@${domain}`;
}
