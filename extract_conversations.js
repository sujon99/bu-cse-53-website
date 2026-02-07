const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'friends_conversations', 'message_1.json');
const outputFile = path.join(__dirname, 'data', 'funny_conversations.json');

try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const conversation = JSON.parse(rawData);

    // Helper function to decoding Facebook's broken Latin-1 encoding to UTF-8
    function decodeFBString(str) {
        if (!str) return str;
        try {
            // Facebook JSON uses Latin-1 characters to represent UTF-8 bytes.
            // We convert the string to a buffer treating it as 'latin1' (binary), then read it back as 'utf8'.
            return Buffer.from(str, 'latin1').toString('utf8');
        } catch (e) {
            return str;
        }
    }

    const allMessages = conversation.messages.map(msg => ({
        ...msg,
        sender_name: decodeFBString(msg.sender_name) || "Unknown Friend",
        content: decodeFBString(msg.content),
        reactions: msg.reactions?.map(r => ({
            ...r,
            reaction: decodeFBString(r.reaction),
            actor: decodeFBString(r.actor)
        }))
    })).filter(msg => msg.content && !msg.is_unsent); // Filter unsent/empty messages

    // Logic to identify "funny" moments
    // We look for messages with "Haha" reactions (ðŸ˜† -> 😆, or similar) or content with laughter emojis.
    // HAHA emoji code points: 😆 (U+1F606), 😂 (U+1F602), 🤣 (U+1F923), 😹 (U+1F639)
    // FB might store reactions as the emoji character itself.

    const funnyMoments = [];
    const processedIndices = new Set();

    // Reverse to process chronological (oldest first) if we iterate normally, but indices are usually Newest=0.
    // Use sequential iteration on reversed array to make logic simpler (Index 0 = Oldest)
    const chronologicalMessages = allMessages.reverse();

    for (let i = 0; i < chronologicalMessages.length; i++) {
        if (processedIndices.has(i)) continue;

        const msg = chronologicalMessages[i];
        let isFunny = false;

        // Check content for laughter emojis
        if (msg.content && /[\u{1F602}\u{1F923}\u{1F606}\u{1F639}]/u.test(msg.content)) {
            isFunny = true;
        }

        // Check reactions for laughter (Facebook 'Haha' reaction is usually 😆 or 😂)
        if (msg.reactions && msg.reactions.some(r => /[\u{1F606}\u{1F602}\u{1F923}]/u.test(r.reaction))) {
            isFunny = true;
        }

        if (isFunny) {
            // Capture context: 1 message before, current, and maybe 1-2 after if they are close in time
            // Simple logic: Take [i-1, i, i+1, i+2] window as a moment

            const start = Math.max(0, i - 1);
            const end = Math.min(chronologicalMessages.length, i + 3); // Exclusive end

            const momentMessages = [];
            for (let k = start; k < end; k++) {
                if (!processedIndices.has(k)) {
                    momentMessages.push({
                        name: chronologicalMessages[k].sender_name,
                        text: chronologicalMessages[k].content,
                        timestamp: chronologicalMessages[k].timestamp_ms
                    });
                    processedIndices.add(k);
                }
            }

            if (momentMessages.length > 0) {
                funnyMoments.push(momentMessages);
            }
        }
    }

    // Flatten logic or keep grouped? User asked for "side of conversation panel... maximum 3/4 relevant/corresponding messages".
    // The 'funnyMoments' array involves arrays of 2-4 messages. This fits the "panel showing 3/4 messages" requirement perfectly.
    // We will save an Array of Arrays (moments), or flatten it? 
    // User said "next button it will show another couple of conversations".
    // So keeping them as chunks (moments) is better.
    // But wait, the previous JSON format was simple array. I should probably update the JSON structure to be Array<Array<Message>>.

    // Let's stick to the requested structure "store them in a separate json with name, text and time".
    // If I change structure, I must update the generic type in the component.
    // Let's make it an object with 'pages' or just an array of items where each item is a moment (array of msgs).

    // Format data to match ConversationViewer expectations
    const formattedOutput = funnyMoments.slice(0, 50).map(moment => ({
        category: 'funny',
        summary: "Funny moment detected", // Placeholder or generate based on content
        messages: moment.map(m => ({
            sender: m.name,
            timestamp: new Date(m.timestamp).toLocaleString(), // Convert to string
            content: m.text
        }))
    }));

    fs.writeFileSync(outputFile, JSON.stringify(formattedOutput, null, 2));
    console.log(`Successfully extracted ${formattedOutput.length} funny moments to ${outputFile}`);

} catch (error) {
    console.error('Error processing messages:', error);
}
