(function () {

  var FORM_URL = "https://script.google.com/macros/s/AKfycby1lu1x6MfKYWCe8opFFdOLAjEmLgGnDHoGj2GsvsCdIqCbehpPrb1HOCy1NdaCw1i7Dg/exec";

  var form = document.getElementById("lead-form");
  var successBox = document.getElementById("form-success");
  var thanksBox = document.getElementById("form-thanks");

  if (!form) return;

  var nome = document.getElementById("nome");
  var cidade = document.getElementById("cidade");
  var clientes = document.getElementById("clientes");
  var investimento = document.getElementById("investimento");
  var anunciaRadios = document.querySelectorAll('input[name="anuncia"]');

  function getRadioValue(name) {
    var r = document.querySelectorAll('input[name="' + name + '"]');
    for (var i = 0; i < r.length; i++) {
      if (r[i].checked) return r[i].value;
    }
    return "";
  }

  function showError(field, msg) {
    var group = field.closest(".form-group");
    if (!group) return;
    group.classList.add("error");
    var el = group.querySelector(".error-msg");
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    var errs = document.querySelectorAll(".form-group.error");
    for (var i = 0; i < errs.length; i++) {
      errs[i].classList.remove("error");
    }
  }

  function getLabel(value, options) {
    for (var i = 0; i < options.length; i++) {
      if (options[i][0] === value) return options[i][1];
    }
    return value;
  }

  function redirectWhatsApp(data) {
    if (data.investimento === "nao-tenho-dinheiro") {
      thanksBox.classList.remove("hidden");
      return;
    }

    var clientesOpts = [
      ["menos-30", "menos de 30"],
      ["30-45", "de 30 a 45"],
      ["45-60", "de 45 a 60"],
      ["mais-60", "mais de 60"]
    ];
    var investOpts = [
      ["ate-140-semana", "até R$ 140 por semana"],
      ["140-250-semana", "de R$ 140 a R$ 250 por semana"],
      ["mais-300-semana", "mais de R$ 300 por semana"]
    ];

    var msg =
      "Olá! Meu nome é " + data.nome +
      ", sou de " + data.cidade + "." +
      " Atendo " + getLabel(data.clientes, clientesOpts) + " clientes por mês." +
      (data.anuncia === "Sim" ? " já anuncio no Google." : " não anuncio no Google.") +
      " Pretendo investir " + getLabel(data.investimento, investOpts) + "." +
      " Gostaria de saber mais sobre o sistema de geração de clientes.";

    window.location.href = "https://wa.me/5551980168744?text=" + encodeURIComponent(msg);
  }

  function validate() {
    var valid = true;
    clearErrors();

    if (!nome.value.trim()) {
      console.log("VALIDACAO: nome vazio");
      showError(nome, "Informe seu nome");
      valid = false;
    }

    if (!cidade.value.trim()) {
      console.log("VALIDACAO: cidade vazio");
      showError(cidade, "Informe sua cidade");
      valid = false;
    }

    if (!clientes.value) {
      console.log("VALIDACAO: clientes vazio");
      showError(clientes, "Selecione quantos clientes atende");
      valid = false;
    }

    if (!getRadioValue("anuncia")) {
      console.log("VALIDACAO: anuncia vazio");
      var group = document.querySelector(".radio-group").closest(".form-group");
      if (group) group.classList.add("error");
      valid = false;
    }

    if (!investimento.value) {
      console.log("VALIDACAO: investimento vazio");
      showError(investimento, "Selecione o valor que pretende investir");
      valid = false;
    }

    return valid;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    console.log("Form submit disparado");

    if (!validate()) {
      console.log("Validação falhou");
      return;
    }

    console.log("Validação passou");

    var telefone = document.getElementById("telefone");

    var data = {
      nome: nome.value.trim(),
      telefone: telefone.value.trim(),
      cidade: cidade.value.trim(),
      clientes: clientes.value,
      anuncia: getRadioValue("anuncia"),
      investimento: investimento.value || "nao-informado"
    };

    console.log("Dados enviados:", data);

    var submitBtn = form.querySelector(".cta-button");
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    if (FORM_URL === "SUBSTITUA_PELA_URL_DO_APPS_SCRIPT") {
      console.log("DEBUG - Lead data:", data);
      form.classList.add("hidden");
      redirectWhatsApp(data);
      return;
    }

    var redirecionou = false;

    function finalizar() {
      if (redirecionou) return;
      redirecionou = true;
      console.log("Finalizando e redirecionando para WhatsApp");
      form.classList.add("hidden");
      redirectWhatsApp(data);
    }

    fetch(FORM_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(data)
    })
      .then(finalizar)
      .catch(finalizar);

    setTimeout(finalizar, 3000);
  });

  var ctas = document.querySelectorAll('a[href="#form-section"]');
  for (var i = 0; i < ctas.length; i++) {
    ctas[i].addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById("form-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

})();
