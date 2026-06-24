// prisma/seed.ts

import { PrismaClient, JudgeType } from "@/generated/prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const USER_ID = "user_3E9Hc7N8KBbo3icCQauMkduRPWj";

async function main() {



    console.log("Seeding database...");



    // ----------------------------
    // Prompts
    // ----------------------------

    const prompts = [
        {
            name: "Summarizer",
            content: "Summarize the following text in 3 bullet points."
        },
        {
            name: "Sentiment Analyzer",
            content: "Classify the sentiment as Positive, Neutral, or Negative."
        },
        {
            name: "Translator",
            content: "Translate the following text into Spanish."
        },
        {
            name: "Grammar Corrector",
            content: "Correct grammar and spelling mistakes."
        },
        {
            name: "Email Generator",
            content: "Write a professional email based on the following information."
        },
        {
            name: "Code Reviewer",
            content: "Review the code and suggest improvements."
        },
        {
            name: "Question Answerer",
            content: "Answer the question as accurately as possible."
        },
        {
            name: "JSON Formatter",
            content: "Return the response in valid JSON format."
        },
        {
            name: "Product Description",
            content: "Generate a compelling product description."
        },
        {
            name: "Meeting Notes",
            content: "Convert the following notes into a meeting summary."
        }
    ];

    await prisma.prompt.createMany({
        data: prompts.map((prompt) => ({
            userId: USER_ID,
            name: prompt.name,
            content: prompt.content,
            version: 1
        }))
    });

    console.log("Created 10 prompts");



    // ----------------------------
    // Datasets
    // ----------------------------



    const summarizerRows = [
        {
            input: "OpenAI released a new model that improves reasoning capabilities while reducing latency for enterprise applications.",
            expectedOutput: "• OpenAI released a new model\n• Reasoning capabilities improved\n• Latency reduced for enterprise use"
        },
        {
            input: "The company reported record quarterly revenue driven by strong cloud adoption and AI infrastructure demand.",
            expectedOutput: "• Record quarterly revenue\n• Growth driven by cloud adoption\n• AI infrastructure demand increased"
        },
        {
            input: "Scientists discovered a new exoplanet that may contain liquid water and potentially support life.",
            expectedOutput: "• New exoplanet discovered\n• May contain liquid water\n• Could support life"
        },
        {
            input: "The city approved a transportation initiative that expands public transit and reduces traffic congestion.",
            expectedOutput: "• Transportation initiative approved\n• Public transit expanded\n• Goal is reducing congestion"
        },
        {
            input: "Researchers developed a battery technology that charges faster and lasts significantly longer.",
            expectedOutput: "• New battery technology developed\n• Faster charging speeds\n• Longer lifespan"
        },
        {
            input: "A startup raised funding to build robotics systems for warehouse automation.",
            expectedOutput: "• Startup raised funding\n• Focus on warehouse robotics\n• Automation is the goal"
        },
        {
            input: "The university launched a new AI curriculum covering machine learning and distributed systems.",
            expectedOutput: "• New AI curriculum launched\n• Covers machine learning\n• Includes distributed systems"
        },
        {
            input: "The sports team won the championship after an undefeated postseason run.",
            expectedOutput: "• Team won championship\n• Undefeated postseason\n• Historic season"
        },
        {
            input: "The government announced incentives for renewable energy investments.",
            expectedOutput: "• New renewable energy incentives\n• Encourages investment\n• Government-backed initiative"
        },
        {
            input: "A cybersecurity vulnerability affecting millions of devices was patched this week.",
            expectedOutput: "• Major vulnerability discovered\n• Millions of devices affected\n• Patch released"
        }
    ];

    const sentimentRows = [
        { input: "I absolutely loved this product.", expectedOutput: "Positive" },
        { input: "The experience was terrible.", expectedOutput: "Negative" },
        { input: "It works as expected.", expectedOutput: "Neutral" },
        { input: "Amazing customer support!", expectedOutput: "Positive" },
        { input: "I want a refund immediately.", expectedOutput: "Negative" },
        { input: "The package arrived on time.", expectedOutput: "Neutral" },
        { input: "Best purchase I've made this year.", expectedOutput: "Positive" },
        { input: "The software crashes constantly.", expectedOutput: "Negative" },
        { input: "Nothing particularly stood out.", expectedOutput: "Neutral" },
        { input: "I'm extremely satisfied.", expectedOutput: "Positive" }
    ];

    const translatorRows = [
        { input: "Hello, how are you?", expectedOutput: "Hola, ¿cómo estás?" },
        { input: "Good morning.", expectedOutput: "Buenos días." },
        { input: "Thank you very much.", expectedOutput: "Muchas gracias." },
        { input: "Where is the train station?", expectedOutput: "¿Dónde está la estación de tren?" },
        { input: "I love programming.", expectedOutput: "Me encanta programar." },
        { input: "The weather is beautiful today.", expectedOutput: "El clima es hermoso hoy." },
        { input: "Can you help me?", expectedOutput: "¿Puedes ayudarme?" },
        { input: "See you tomorrow.", expectedOutput: "Nos vemos mañana." },
        { input: "This is my favorite book.", expectedOutput: "Este es mi libro favorito." },
        { input: "Have a great day!", expectedOutput: "¡Que tengas un gran día!" }
    ];

    const grammarRows = [
        { input: "I has a dog.", expectedOutput: "I have a dog." },
        { input: "She dont like pizza.", expectedOutput: "She doesn't like pizza." },
        { input: "They was happy.", expectedOutput: "They were happy." },
        { input: "We is going home.", expectedOutput: "We are going home." },
        { input: "He go to school everyday.", expectedOutput: "He goes to school every day." },
        { input: "Your the best.", expectedOutput: "You're the best." },
        { input: "Its raining.", expectedOutput: "It's raining." },
        { input: "I seen that movie.", expectedOutput: "I saw that movie." },
        { input: "There going now.", expectedOutput: "They're going now." },
        { input: "The cat sleep on couch.", expectedOutput: "The cat sleeps on the couch." }
    ];

    const emailRows = [
        {
            input: "Request a meeting with a hiring manager next week.",
            expectedOutput: "Professional meeting request email."
        },
        {
            input: "Thank a recruiter for their time.",
            expectedOutput: "Professional thank-you email."
        },
        {
            input: "Ask for a project deadline extension.",
            expectedOutput: "Professional extension request email."
        },
        {
            input: "Decline an interview politely.",
            expectedOutput: "Professional interview decline email."
        },
        {
            input: "Follow up after submitting an application.",
            expectedOutput: "Professional follow-up email."
        },
        {
            input: "Request feedback after an interview.",
            expectedOutput: "Professional feedback request email."
        },
        {
            input: "Notify team of delayed deliverable.",
            expectedOutput: "Professional status update email."
        },
        {
            input: "Invite colleagues to a meeting.",
            expectedOutput: "Professional meeting invitation email."
        },
        {
            input: "Announce project completion.",
            expectedOutput: "Professional project completion email."
        },
        {
            input: "Welcome a new team member.",
            expectedOutput: "Professional welcome email."
        }
    ];



    const codeReviewRows = [
        {
            input: `for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }`,
            expectedOutput: "Use a for...of loop or array.forEach for improved readability."
        },
        {
            input: `const x = data.filter(x => x.active)[0];`,
            expectedOutput: "Consider using Array.find() instead of filter()[0]."
        },
        {
            input: `var count = 0;`,
            expectedOutput: "Use let or const instead of var."
        },
        {
            input: `function add(a,b){return a+b}`,
            expectedOutput: "Add spacing and formatting for readability."
        },
        {
            input: `if (user == null) {}`,
            expectedOutput: "Consider using strict equality checks."
        },
        {
            input: `fetch('/api/users').then(res => res.json()).then(data => console.log(data));`,
            expectedOutput: "Add error handling using catch() or try/catch."
        },
        {
            input: `const result = await getData();`,
            expectedOutput: "Consider wrapping asynchronous calls in try/catch."
        },
        {
            input: `const items = []; for(let i=0;i<1000;i++){ items.push(i); }`,
            expectedOutput: "Code is functional but formatting could be improved."
        },
        {
            input: `if (flag === true) { doThing(); }`,
            expectedOutput: "Simplify condition to if (flag)."
        },
        {
            input: `const user = users.find(u => u.id === id);`,
            expectedOutput: "Code is clear and follows good practices."
        }
    ];

    const qaRows = [
        {
            input: "What is the capital of France?",
            expectedOutput: "Paris"
        },
        {
            input: "Who wrote Romeo and Juliet?",
            expectedOutput: "William Shakespeare"
        },
        {
            input: "What planet is known as the Red Planet?",
            expectedOutput: "Mars"
        },
        {
            input: "What is the largest ocean on Earth?",
            expectedOutput: "Pacific Ocean"
        },
        {
            input: "What is 12 multiplied by 8?",
            expectedOutput: "96"
        },
        {
            input: "Who developed the theory of relativity?",
            expectedOutput: "Albert Einstein"
        },
        {
            input: "What is the chemical symbol for gold?",
            expectedOutput: "Au"
        },
        {
            input: "Which language is primarily spoken in Brazil?",
            expectedOutput: "Portuguese"
        },
        {
            input: "What is the tallest mountain in the world?",
            expectedOutput: "Mount Everest"
        },
        {
            input: "What year did World War II end?",
            expectedOutput: "1945"
        }
    ];

    const jsonRows = [
        {
            input: "John is 25 years old.",
            expectedOutput: `{"name":"John","age":25}`
        },
        {
            input: "Product: Laptop, Price: 1200",
            expectedOutput: `{"product":"Laptop","price":1200}`
        },
        {
            input: "City: New York, Population: 8400000",
            expectedOutput: `{"city":"New York","population":8400000}`
        },
        {
            input: "Name Sarah, Occupation Engineer",
            expectedOutput: `{"name":"Sarah","occupation":"Engineer"}`
        },
        {
            input: "Book: Dune, Author: Frank Herbert",
            expectedOutput: `{"book":"Dune","author":"Frank Herbert"}`
        },
        {
            input: "Animal: Dog, Legs: 4",
            expectedOutput: `{"animal":"Dog","legs":4}`
        },
        {
            input: "Country: Japan, Capital: Tokyo",
            expectedOutput: `{"country":"Japan","capital":"Tokyo"}`
        },
        {
            input: "Course: Algorithms, Credits: 4",
            expectedOutput: `{"course":"Algorithms","credits":4}`
        },
        {
            input: "Movie: Inception, Year: 2010",
            expectedOutput: `{"movie":"Inception","year":2010}`
        },
        {
            input: "Language: Python, Paradigm: Multi-paradigm",
            expectedOutput: `{"language":"Python","paradigm":"Multi-paradigm"}`
        }
    ];

    const productDescriptionRows = [
        {
            input: "Wireless noise-cancelling headphones",
            expectedOutput: "A compelling product description highlighting premium sound quality, comfort, and active noise cancellation."
        },
        {
            input: "Stainless steel water bottle",
            expectedOutput: "A product description emphasizing durability, insulation, and portability."
        },
        {
            input: "Mechanical keyboard",
            expectedOutput: "A product description focusing on responsiveness, build quality, and typing experience."
        },
        {
            input: "Smart fitness watch",
            expectedOutput: "A product description highlighting health tracking and connectivity features."
        },
        {
            input: "Portable Bluetooth speaker",
            expectedOutput: "A product description emphasizing sound quality and portability."
        },
        {
            input: "Ergonomic office chair",
            expectedOutput: "A product description focusing on comfort and productivity."
        },
        {
            input: "Gaming mouse",
            expectedOutput: "A product description emphasizing precision, customization, and performance."
        },
        {
            input: "4K monitor",
            expectedOutput: "A product description highlighting image quality and productivity benefits."
        },
        {
            input: "Robot vacuum cleaner",
            expectedOutput: "A product description emphasizing automation and convenience."
        },
        {
            input: "Electric standing desk",
            expectedOutput: "A product description focusing on flexibility, health benefits, and workspace optimization."
        }
    ];

    const meetingNotesRows = [
        {
            input: "Team discussed launching feature X next month. Engineering will finish implementation by Friday. Marketing will prepare announcement materials.",
            expectedOutput: "Feature X launch planned next month. Engineering completes implementation by Friday. Marketing prepares launch materials."
        },
        {
            input: "Budget review completed. Finance approved additional cloud spending. Team will revisit costs next quarter.",
            expectedOutput: "Budget reviewed. Additional cloud spending approved. Costs reassessed next quarter."
        },
        {
            input: "Recruiting team interviewed three candidates. Two will advance to final round.",
            expectedOutput: "Three candidates interviewed. Two advance to final round."
        },
        {
            input: "Customer reported login issues. Engineering assigned investigation and patch deployment.",
            expectedOutput: "Login issues reported. Engineering investigating and preparing patch."
        },
        {
            input: "Product roadmap reviewed. Mobile improvements prioritized for Q3.",
            expectedOutput: "Roadmap reviewed. Mobile improvements prioritized for Q3."
        },
        {
            input: "Security audit completed. Several low-risk findings identified.",
            expectedOutput: "Security audit completed. Low-risk findings documented."
        },
        {
            input: "Sales exceeded quarterly targets by 15%. Team discussed expansion opportunities.",
            expectedOutput: "Sales exceeded targets by 15%. Expansion opportunities discussed."
        },
        {
            input: "Design team presented updated mockups. Feedback requested by end of week.",
            expectedOutput: "Updated mockups presented. Feedback due by week end."
        },
        {
            input: "Operations team reported infrastructure upgrades completed successfully.",
            expectedOutput: "Infrastructure upgrades completed successfully."
        },
        {
            input: "Leadership discussed hiring plans and approved two additional engineering headcount positions.",
            expectedOutput: "Hiring plans reviewed. Two engineering positions approved."
        }
    ];







    const datasetDefinitions = [
        ["Summarization Dataset", summarizerRows],
        ["Sentiment Dataset", sentimentRows],
        ["Translation Dataset", translatorRows],
        ["Grammar Dataset", grammarRows],
        ["Email Dataset", emailRows],
        ["Code Review Dataset", codeReviewRows],
        ["Question Answering Dataset", qaRows],
        ["JSON Formatting Dataset", jsonRows],
        ["Product Description Dataset", productDescriptionRows],
        ["Meeting Notes Dataset", meetingNotesRows],
    ];

    const datasets = datasetDefinitions.map(([name, rows]) => ({
        userId: USER_ID,
        name,
        version: 1,
        numberOfEntries: rows.length,
        rows
    }));

    await prisma.dataset.createMany({
        data: datasets
    });





    // ----------------------------
    // Judge
    // ----------------------------

    await prisma.judge.create({
        data: {
            userId: USER_ID,
            name: "LLM Quality Judge",
            type: JudgeType.LLM,
            rubric: `
                        You are evaluating an AI assistant response.

                        Score the response from 0.0 to 1.0 based on:

                        - Correctness
                        - Helpfulness
                        - Clarity
                        - Completeness

                        Return ONLY valid JSON:

                        {
                        "score": number,
                        "passed": boolean,
                        "reasoning": string
                        }`
        }
    });

    console.log("Created LLM judge");
    console.log("Seed complete");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });