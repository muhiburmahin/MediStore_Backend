import app from "../../../MediStore/MediStore_Backend/src/app";
import { prisma } from "../../../MediStore/MediStore_Backend/src/lib/prisma";
const port = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();
        console.log("prisma connected successfully");

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`)
        })

    }
    catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main(); 