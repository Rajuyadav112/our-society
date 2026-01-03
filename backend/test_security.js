const http = require('http');

const PHONE = '8421125950';

function post(path, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        }, (res) => {
            let resData = '';
            res.on('data', (chunk) => resData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(resData);
                    if (res.statusCode >= 400) reject(parsed);
                    else resolve(parsed);
                } catch (e) {
                    reject(resData);
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function test() {
    try {
        console.log("Testing forgot-password security...");
        const res1 = await post('/users/forgot-password', { phone: PHONE });
        console.log("Response received:", res1);

        if (res1.otp) {
            console.error("FAILURE: OTP found in response!");
        } else {
            console.log("SUCCESS: OTP NOT found in response.");
        }

    } catch (err) {
        console.error("Verification failed:", err);
    }
}

test();
