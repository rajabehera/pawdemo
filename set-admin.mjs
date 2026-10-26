import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("./firebase-service-account.json", "utf8"));
initializeApp({ credential: cert(serviceAccount) });

const email = process.argv[2];
if (!email) throw new Error("Usage: node set-admin.mjs you@gmail.com");

const user = await getAuth().getUserByEmail(email); // user must have signed in once already
await getAuth().setCustomUserClaims(user.uid, { admin: true });
console.log("✅ Admin claim set for", email, "uid:", user.uid);


/*const old = await getAuth().getUserByEmail("old@gmail.com");
await getAuth().setCustomUserClaims(old.uid, { admin: false }); // or null to clear all claims

const next = await getAuth().getUserByEmail("new@gmail.com");
await getAuth().setCustomUserClaims(next.uid, { admin: true });*/