// Using native fetch content
// Using native fetch if Node 18+, else https. Node 24 is reported.
// Node 24 definitely has fetch.

async function testTunnel() {
    try {
        console.log("Testing Tunnel URL...");
        const response = await fetch("https://society-app-debug-live.loca.lt/", {
            headers: { "Bypass-Tunnel-Reminder": "true" }
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Content-Type:", response.headers.get('content-type'));
        console.log("Body Snippet:", text.substring(0, 100));
    } catch (err) {
        console.error("Tunnel Test Failed:", err);
    }
}

testTunnel();
