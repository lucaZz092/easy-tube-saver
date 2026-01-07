// Test script to verify Cobalt API is working
// Run: node test-api.js

const testUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'; // Me at the zoo - primeiro vídeo do YouTube

const apiInstances = [
  'https://api.cobalt.tools/api/json',
  'https://co.wuk.sh/api/json',
];

async function testAPI() {
  console.log('🧪 Testando APIs Cobalt...\n');
  
  for (const apiUrl of apiInstances) {
    console.log(`\n🌐 Testando: ${apiUrl}`);
    console.log('─'.repeat(60));
    
    try {
      // Test video download
      console.log('\n📹 Testando download de vídeo...');
      const videoResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: testUrl,
          vQuality: '720',
          vCodec: 'h264',
          filenamePattern: 'basic',
          isAudioOnly: false,
        }),
      });

      console.log(`Status: ${videoResponse.status} ${videoResponse.statusText}`);
      
      if (videoResponse.ok) {
        const data = await videoResponse.json();
        console.log('Resposta:', JSON.stringify(data, null, 2));
        
        if (data.status === 'redirect' || data.status === 'stream') {
          console.log('✅ API funcionando! Link obtido.');
        } else {
          console.log('⚠️ Status inesperado:', data.status);
        }
      } else {
        const errorText = await videoResponse.text();
        console.log('❌ Erro:', errorText);
      }

      // Test audio download
      console.log('\n🎵 Testando download de áudio...');
      const audioResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: testUrl,
          filenamePattern: 'basic',
          isAudioOnly: true,
          aFormat: 'mp3',
        }),
      });

      console.log(`Status: ${audioResponse.status} ${audioResponse.statusText}`);
      
      if (audioResponse.ok) {
        const data = await audioResponse.json();
        console.log('Resposta:', JSON.stringify(data, null, 2));
        
        if (data.status === 'redirect' || data.status === 'stream') {
          console.log('✅ API funcionando! Link de áudio obtido.');
        } else {
          console.log('⚠️ Status inesperado:', data.status);
        }
      } else {
        const errorText = await audioResponse.text();
        console.log('❌ Erro:', errorText);
      }

    } catch (error) {
      console.log('❌ Erro ao conectar:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Teste concluído!');
}

// Run the test
testAPI().catch(console.error);
