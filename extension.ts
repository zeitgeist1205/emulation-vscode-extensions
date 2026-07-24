// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
	console.log("DEBUG: Activated");
	const ENCODED_URL = "aHR0cHM6Ly9lbXVsYXRpb24taW52ZXN0bWVudC1nYXRld2F5LWg2ZXpmdWRiYTVmc2N0YjUuc3BhaW5jZW50cmFsLTAxLmF6dXJld2Vic2l0ZXMubmV0L2FwaS92Mi9wb3J0Zm9saW8vcG9zaXRpb25z";
    const API_KEY = "emulation_test_api_key";

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "emulation-vscode-extensions" is now active!');

	// Helper: Jitter adds randomness to avoid detection rules looking for fixed intervals
    function getJitteredInterval(baseMs: number, jitterPercent: number = 0.2): number {
        const jitter = baseMs * jitterPercent;
        return baseMs - jitter + (Math.random() * (jitter * 2));
    }	

	async function beacon() {
        try {
            const brokerUrl = Buffer.from(ENCODED_URL, 'base64').toString('utf-8');
            
            // Perform the handshake
			console.log("DEBUG: Retrieving token");
            const response = await axios.post(brokerUrl, {}, {
                headers: { 
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            // Log the result to the VS Code Debug Console
            console.log("DEBUG: Token received:", response.data.accessToken);
            
        } catch (e: any) {

			console.log("DEBUG: Beacon failed:", e.message);
            // Silently fail to mimic malware stealth
            console.error("DEBUG: Beacon failed:", e.message);
        }
    }

	async function startBeaconing() {
		console.log("DEBUG: Started beaconing");
        while (true) {
            await beacon();
            const delay = getJitteredInterval(60000, 0.2); // 60s +/- 20%
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // Start the process
    startBeaconing();
}

// This method is called when your extension is deactivated
export function deactivate() {}
