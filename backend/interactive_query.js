const { Sequelize } = require('sequelize');
const readline = require('readline');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './society.db',
    logging: false
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function executeQuery(query) {
    if (!query.trim()) {
        return;
    }

    try {
        const [results] = await sequelize.query(query);

        if (results.length === 0) {
            console.log('\n⚠️  No results found\n');
        } else {
            console.log('\n✅ Results:\n');
            console.table(results);
            console.log(`\n📊 Total Rows: ${results.length}\n`);
        }
    } catch (err) {
        console.error('\n❌ Error:', err.message, '\n');
    }

    rl.prompt();
}

async function start() {
    try {
        await sequelize.authenticate();
        console.log('\n✅ Connected to database successfully!\n');
        console.log('━'.repeat(50));
        console.log('💡 Interactive SQL Query Mode');
        console.log('━'.repeat(50));
        console.log('\nCommands:');
        console.log('  - Type SQL query and press Enter');
        console.log('  - Type "exit" or "quit" to close');
        console.log('  - Type "help" for example queries\n');
        console.log('━'.repeat(50), '\n');

        rl.setPrompt('SQL> ');
        rl.prompt();

        rl.on('line', async (input) => {
            const cmd = input.trim().toLowerCase();

            if (cmd === 'exit' || cmd === 'quit') {
                console.log('\n👋 Goodbye!\n');
                await sequelize.close();
                rl.close();
                process.exit(0);
            } else if (cmd === 'help') {
                console.log('\n📚 Example Queries:\n');
                console.log('  SELECT * FROM Users;');
                console.log('  SELECT id, name, phone FROM Users WHERE role = "admin";');
                console.log('  SELECT COUNT(*) as total FROM Users;');
                console.log('  SELECT * FROM Users WHERE name LIKE "%Raju%";');
                console.log('  SELECT wing, COUNT(*) as count FROM Users GROUP BY wing;\n');
                rl.prompt();
            } else {
                await executeQuery(input);
            }
        });

        rl.on('close', async () => {
            await sequelize.close();
            process.exit(0);
        });

    } catch (err) {
        console.error('❌ Connection Error:', err.message);
        process.exit(1);
    }
}

start();
