export function getCaptcha() {
  const charsArray = "0123456789";
  const lengthOtp = 6;
  let captcha = "";

  for (let i = 0; i < lengthOtp; i++) {
    const index = Math.floor(Math.random() * charsArray.length);
    captcha += charsArray[index];
  }

  return captcha;
}
