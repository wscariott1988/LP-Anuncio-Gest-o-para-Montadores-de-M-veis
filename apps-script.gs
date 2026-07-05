/**
 * Google Apps Script — Receptor de Leads da Landing Page
 *
 * COMO USAR:
 * 1. Abra sua planilha no Google Sheets
 * 2. Vá em Extensões > Apps Script
 * 3. Cole este código (substitua todo o conteúdo)
 * 4. Salve (CTRL+S)
 * 5. Clique em "Implantar" > "Nova implantação"
 * 6. Tipo: "Aplicativo da Web"
 * 7. Executar como: "Eu"
 * 8. Quem tem acesso: "Qualquer pessoa"
 * 9. Clique em "Implantar"
 * 10. COPIE a URL gerada (algo como:
 *     https://script.google.com/macros/s/.../exec)
 * 11. Abra o arquivo js/main.js e cole a URL no lugar de
 *     "SUBSTITUA_PELA_URL_DO_APPS_SCRIPT"
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria cabeçalhos na primeira linha se estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data",
        "Nome",
        "Telefone",
        "Cidade",
        "Clientes por mês",
        "Já anuncia no Google?",
        "Investimento pretendido",
        "Origem"
      ]);
    }

    // Mapeamento amigável da origem para a planilha
    let origemPlanilha = "#direto";
    if (data.origem === "whatsapp") {
      origemPlanilha = "#grupowhatsapp";
    } else if (data.origem === "facebook") {
      origemPlanilha = "#grupofacebook";
    } else if (data.origem) {
      origemPlanilha = "#" + data.origem;
    }

    sheet.appendRow([
      new Date(),
      data.nome || "",
      data.telefone || "",
      data.cidade || "",
      data.clientes || "",
      data.anuncia || "",
      data.investimento || "",
      origemPlanilha
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
