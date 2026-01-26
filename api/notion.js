// 노션과 위젯 사이를 연결해주는 서버 코드 (Vercel 전용)
export default async function handler(req, res) {
    const { token, dbId, method, data } = req.body;

    // 1. 노션 DB에서 마지막 설정 불러오기
    if (method === 'GET') {
        const response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        res.status(200).json(result);
    } 
    // 2. 노션 DB에 현재 설정 저장하기
    else if (method === 'SAVE') {
        const response = await fetch(`https://api.notion.com/v1/pages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parent: { database_id: dbId },
                properties: {
                    "제목": { "title": [{ "text": { "content": "Camera Config" } }] },
                    "ImageURL": { "rich_text": [{ "text": { "content": data.img } }] },
                    "X": { "number": data.x },
                    "Y": { "number": data.y },
                    "Bright": { "number": data.bright },
                    "Contrast": { "number": data.contrast },
                    "Theme": { "rich_text": [{ "text": { "content": data.theme } }] }
                }
            })
        });
        const result = await response.json();
        res.status(200).json(result);
    }
}
