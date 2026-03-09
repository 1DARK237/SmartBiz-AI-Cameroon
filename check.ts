import fetch from 'node-fetch';

async function check() {
  try {
    const res = await fetch('http://localhost:3000/api/images');
    console.log(res.status);
  } catch (e) {
    console.error(e);
  }
}
check();
