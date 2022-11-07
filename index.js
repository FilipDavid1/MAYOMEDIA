function login() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Login successful');
    }, 1000);
  });
}