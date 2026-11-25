/* =========================================================
   SPA BETTY — INTERACTIVE WEBSITE, STORE & LIVE-SYNCED CRM
========================================================= */

(function () {
  const STORAGE_KEY = "spa_betty_demo_state_v1";

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  function getInitialState() {
    const seed = clone(window.SPA_BETTY_SEED);
    return {
      services: seed.services,
      products: seed.products,
      staff: seed.staff,
      clients: seed.clients,
      appointments: seed.appointments,
      sales: seed.sales,
      cart: [],
      unreadSyncCount: 0
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.services) && Array.isArray(parsed.sales)) {
          return parsed;
        }
      }
    } catch (_) {}
    return getInitialState();
  }

  let state = loadState();
  let activeServiceCat = "all";
  let activeCrmTab = "dashboard";
  let activeCabinFilter = "all";
  let activeStatusFilter = "all";
  let activeSalesMethod = "all";
  let activeSalesQuery = "";
  let activeClientTier = "all";
  let activeClientQuery = "";
  let bookingStep = 1;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  const fmtS = (val) => `S/ ${Number(val || 0).toFixed(2)}`;

  function nowTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* =========================================================
     TOAST NOTIFICATIONS
  ========================================================= */
  function showToast(title, message, actionLabel, actionCb) {
    const container = document.getElementById("toast-container");
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `
      <div><strong>${title}</strong><br/><span>${message}</span></div>
    `;
    if (actionLabel && typeof actionCb === "function") {
      const btn = document.createElement("button");
      btn.className = "toast-action";
      btn.textContent = actionLabel;
      btn.addEventListener("click", () => {
        actionCb();
        el.remove();
      });
      el.appendChild(btn);
    }
    container.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.remove();
    }, actionLabel ? 10000 : 6000);
  }

  /* =========================================================
     TOP MODE SWITCHING (WEB / CRM / BRAND)
  ========================================================= */
  function switchMode(mode, targetCrmTab) {
    document.querySelectorAll(".app-view").forEach((v) => v.classList.remove("active"));
    document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));

    const viewEl = document.getElementById(`view-${mode}`);
    const btnEl = document.getElementById(`tab-mode-${mode}`);
    if (viewEl) viewEl.classList.add("active");
    if (btnEl) btnEl.classList.add("active");

    if (mode === "crm") {
      state.unreadSyncCount = 0;
      saveState();
      updateSyncBadge();
      if (targetCrmTab) switchCrmTab(targetCrmTab);
      renderAllCRM();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    refreshIcons();
  }

  function updateSyncBadge() {
    const badge = document.getElementById("crm-sync-badge");
    if (!badge) return;
    if (state.unreadSyncCount > 0) {
      badge.hidden = false;
      badge.textContent = `+${state.unreadSyncCount}`;
    } else {
      badge.hidden = true;
    }
  }

  /* =========================================================
     WEBSITE RENDERERS (SERVICES & PRODUCTS)
  ========================================================= */
  function renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid) return;

    const list =
      activeServiceCat === "all"
        ? state.services
        : state.services.filter((s) => s.category === activeServiceCat);

    grid.innerHTML = list
      .map(
        (srv) => `
      <article class="service-card">
        <div>
          <div class="service-card-top">
            <span class="service-cabin-tag">${srv.cabin} · ${srv.categoryLabel}</span>
            ${srv.promo ? `<span class="service-badge-promo">${srv.promo}</span>` : ""}
          </div>
          <h3>${srv.name}</h3>
          <p>${srv.description}</p>
          <div class="service-meta">
            <span><i data-lucide="clock"></i> ${srv.duration}</span>
            <span><i data-lucide="shield-check"></i> Confirmación inmediata</span>
          </div>
        </div>
        <div class="service-card-foot">
          <div class="price-block">
            ${srv.oldPrice ? `<span class="price-old">${fmtS(srv.oldPrice)}</span>` : ""}
            <span class="price-main">${fmtS(srv.price)}</span>
          </div>
          <button class="btn btn-primary btn-sm" data-book-service="${srv.id}">
            <i data-lucide="calendar-plus"></i>
            <span>Reservar</span>
          </button>
        </div>
      </article>
    `
      )
      .join("");

    refreshIcons();
  }

  function renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    grid.innerHTML = state.products
      .map((prd) => {
        const isLow = prd.stock <= prd.minStock;
        const out = prd.stock <= 0;
        return `
        <article class="product-card">
          <div>
            <div class="product-top">
              <div class="product-icon-badge"><i data-lucide="${prd.icon || "package"}"></i></div>
              <span class="stock-pill ${isLow ? "low" : ""}">
                ${out ? "Agotado" : `${prd.stock} en stock`}
              </span>
            </div>
            <h3>${prd.name}</h3>
            <p>${prd.description}</p>
          </div>
          <div class="product-foot">
            <span class="product-price">${fmtS(prd.price)}</span>
            <button class="btn btn-aqua btn-sm" data-add-cart="${prd.id}" ${out ? "disabled" : ""}>
              <i data-lucide="shopping-bag"></i>
              <span>${out ? "Sin Stock" : "Añadir"}</span>
            </button>
          </div>
        </article>
      `;
      })
      .join("");

    refreshIcons();
  }

  /* =========================================================
     ONLINE CART & E-COMMERCE CHECKOUT
  ========================================================= */
  function updateCartUI() {
    const countEl = document.getElementById("header-cart-count");
    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (countEl) countEl.textContent = totalQty;

    const listEl = document.getElementById("cart-items-list");
    const subEl = document.getElementById("cart-subtotal");
    const checkoutFields = document.getElementById("cart-checkout-fields");
    const checkoutBtn = document.getElementById("btn-cart-checkout");

    if (!listEl) return;

    if (state.cart.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding: 48px 16px; color: var(--muted);">
          <p style="font-size:15px; margin:0 0 8px;">Tu carrito está vacío</p>
          <p style="font-size:13px; margin:0;">Agrega nuestro Talco Crema de Menta u otros productos clínicos para probar la compra sincronizada con el CRM.</p>
        </div>
      `;
      if (subEl) subEl.textContent = fmtS(0);
      if (checkoutFields) checkoutFields.hidden = true;
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    let subtotal = 0;
    listEl.innerHTML = state.cart
      .map((item) => {
        const prd = state.products.find((p) => p.id === item.productId);
        if (!prd) return "";
        const lineTotal = prd.price * item.qty;
        subtotal += lineTotal;
        return `
        <div class="cart-item-row">
          <div>
            <strong>${prd.name}</strong>
            <span>${fmtS(prd.price)} c/u · Subtotal: ${fmtS(lineTotal)}</span>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" data-cart-dec="${prd.id}">−</button>
            <strong>${item.qty}</strong>
            <button class="qty-btn" data-cart-inc="${prd.id}">+</button>
          </div>
        </div>
      `;
      })
      .join("");

    if (subEl) subEl.textContent = fmtS(subtotal);
    if (checkoutFields) checkoutFields.hidden = false;
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  function addToCart(productId) {
    const prd = state.products.find((p) => p.id === productId);
    if (!prd || prd.stock <= 0) return;

    const existing = state.cart.find((i) => i.productId === productId);
    if (existing) {
      if (existing.qty >= prd.stock) {
        showToast("Stock máximo alcanzado", `Solo quedan ${prd.stock} unidades de ${prd.name}.`);
        return;
      }
      existing.qty += 1;
    } else {
      state.cart.push({ productId, qty: 1 });
    }
    saveState();
    updateCartUI();
    showToast("Producto agregado", `${prd.name} añadido a tu carrito.`, "Ver Carrito", () => openDrawer("drawer-cart"));
  }

  function completeCartCheckout() {
    if (state.cart.length === 0) return;
    const buyerName = document.getElementById("cart-buyer-name").value.trim() || "Cliente Web Online";
    const buyerPhone = document.getElementById("cart-buyer-phone").value.trim() || "987 000 111";
    const payMethod = document.getElementById("cart-pay-method").value || "Yape";

    let totalAmount = 0;
    const itemLabels = [];

    state.cart.forEach((item) => {
      const prd = state.products.find((p) => p.id === item.productId);
      if (!prd) return;
      const qty = Math.min(item.qty, prd.stock);
      prd.stock = Math.max(0, prd.stock - qty);
      totalAmount += prd.price * qty;
      itemLabels.push(qty > 1 ? `${prd.name} (x${qty})` : prd.name);
    });

    const saleId = `VTA-${2049 + state.sales.length}`;
    const concept = itemLabels.join(" + ");

    state.sales.unshift({
      id: saleId,
      time: nowTime(),
      clientName: buyerName,
      concept,
      type: "Producto",
      category: "Tienda Productos",
      staffId: "stf-beatriz",
      staffName: "Tienda Online (Web)",
      method: payMethod,
      channel: "Tienda Online",
      amount: totalAmount,
      isNew: true
    });

    upsertClient(buyerName, buyerPhone, "", concept, totalAmount, "Compra realizada desde Tienda Online.");

    state.cart = [];
    state.unreadSyncCount += 1;
    saveState();
    updateCartUI();
    renderProducts();
    updateSyncBadge();
    closeDrawer("drawer-cart");

    showToast(
      `¡Compra Online Exitosa (${fmtS(totalAmount)})!`,
      `Stock descontado y venta ${saleId} registrada en vivo en el CRM (${payMethod}).`,
      "Ver en el CRM →",
      () => switchMode("crm", "ventas")
    );
  }

  /* =========================================================
     ONLINE BOOKING WIZARD + PERUVIAN PAYMENT GATEWAY
  ========================================================= */
  function openBookingModal(preselectServiceId, preselectCategory) {
    const srvSelect = document.getElementById("bk-service");
    const staffSelect = document.getElementById("bk-staff");
    const dateInput = document.getElementById("bk-date");

    srvSelect.innerHTML = state.services
      .map((s) => `<option value="${s.id}">${s.name} — ${fmtS(s.price)} (${s.cabin})</option>`)
      .join("");

    staffSelect.innerHTML = state.staff
      .filter((st) => st.id !== "stf-beatriz")
      .map((st) => `<option value="${st.id}">${st.name} (${st.cabin})</option>`)
      .join("");

    if (preselectServiceId) {
      srvSelect.value = preselectServiceId;
    } else if (preselectCategory) {
      const match = state.services.find((s) => s.category === preselectCategory);
      if (match) srvSelect.value = match.id;
    }

    syncBookingStaffAndSummary();

    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;

    setBookingStep(1);
    openModal("modal-booking");
  }

  function syncBookingStaffAndSummary() {
    const srvId = document.getElementById("bk-service").value;
    const srv = state.services.find((s) => s.id === srvId) || state.services[0];
    const staffSelect = document.getElementById("bk-staff");
    if (srv && srv.defaultStaffId) {
      staffSelect.value = srv.defaultStaffId;
    }
    const summaryBox = document.getElementById("bk-summary-preview");
    const gwTotal = document.getElementById("bk-gateway-total");
    if (summaryBox && srv) {
      summaryBox.innerHTML = `
        <div>
          <strong style="color:var(--navy); display:block;">${srv.name}</strong>
          <span style="color:var(--muted); font-size:12.5px;">${srv.cabin} · Duración estimada: ${srv.duration}</span>
        </div>
        <strong style="font-size:20px; color:var(--navy);">${fmtS(srv.price)}</strong>
      `;
    }
    if (gwTotal && srv) {
      gwTotal.textContent = fmtS(srv.price);
    }
  }

  function setBookingStep(step) {
    bookingStep = step;
    document.querySelectorAll(".booking-step-pane").forEach((p, idx) => {
      p.classList.toggle("active", idx + 1 === step);
    });
    document.querySelectorAll(".bstep").forEach((el) => {
      el.classList.toggle("active", Number(el.dataset.bstep) <= step);
    });
  }

  function handleBookingSubmit(e) {
    e.preventDefault();
    const srvId = document.getElementById("bk-service").value;
    const srv = state.services.find((s) => s.id === srvId);
    const staffId = document.getElementById("bk-staff").value;
    const staff = state.staff.find((st) => st.id === staffId) || state.staff[0];
    const time = document.getElementById("bk-time").value;
    const name = document.getElementById("bk-name").value.trim() || "Cliente Nuevo Web";
    const phone = document.getElementById("bk-phone").value.trim() || "990 123 456";
    const email = document.getElementById("bk-email").value.trim();
    const notes = document.getElementById("bk-notes").value.trim() || "Reserva pagada desde la web oficial.";
    const payMethodEl = document.querySelector('input[name="bk-pay-method"]:checked');
    const payMethod = payMethodEl ? payMethodEl.value : "Yape";

    const aptId = `APT-${107 + state.appointments.length}`;
    const vtaId = `VTA-${2049 + state.sales.length}`;

    state.appointments.unshift({
      id: aptId,
      date: "Hoy",
      time,
      clientName: name,
      clientPhone: phone,
      serviceId: srv.id,
      serviceName: srv.name,
      cabin: srv.cabin,
      staffId: staff.id,
      staffName: staff.name,
      channel: "Web Online",
      paymentMethod: payMethod,
      paid: true,
      amount: srv.price,
      status: "Confirmada",
      isNew: true
    });

    state.sales.unshift({
      id: vtaId,
      time: nowTime(),
      clientName: name,
      concept: srv.name,
      type: "Servicio",
      category: srv.categoryLabel,
      staffId: staff.id,
      staffName: staff.name,
      method: payMethod,
      channel: "Web Online",
      amount: srv.price,
      isNew: true
    });

    upsertClient(name, phone, email, srv.name, srv.price, notes);

    state.unreadSyncCount += 1;
    saveState();
    updateSyncBadge();
    closeModal("modal-booking");
    document.getElementById("booking-form").reset();

    showToast(
      `¡Reserva Confirmada (${aptId})!`,
      `${name} · ${srv.name} (${srv.cabin}) pagado con ${payMethod}. Sincronizado en vivo con el CRM.`,
      "Ver en el CRM →",
      () => switchMode("crm", "citas")
    );
  }

  /* =========================================================
     CLIENT UPSERT & LOYALTY ENGINE
  ========================================================= */
  function upsertClient(name, phone, email, itemLabel, amount, note) {
    let client = state.clients.find(
      (c) => c.name.toLowerCase() === name.toLowerCase() || (phone && c.phone.replace(/\s/g, "") === phone.replace(/\s/g, ""))
    );
    const earnedPoints = Math.round(amount / 2);

    if (client) {
      client.visits += 1;
      client.totalSpent += amount;
      client.points += earnedPoints;
      client.lastVisit = "Hoy";
      client.lastService = itemLabel;
      if (client.visits >= 10 && client.tier !== "Club Ciclista") client.tier = "VIP Oro";
      else if (client.visits >= 3 && client.tier === "Nuevo") client.tier = "Frecuente";
      client.history.unshift({ date: "Hoy", item: itemLabel, amount });
    } else {
      state.clients.unshift({
        id: `cli-${Date.now()}`,
        name,
        phone: phone || "Sin teléfono",
        email: email || "registrado@web.pe",
        tier: "Nuevo",
        visits: 1,
        totalSpent: amount,
        points: earnedPoints,
        lastVisit: "Hoy",
        lastService: itemLabel,
        notes: note || "Registrado desde plataforma digital.",
        history: [{ date: "Hoy", item: itemLabel, amount }]
      });
    }
  }

  /* =========================================================
     CRM RENDERERS
  ========================================================= */
  const CRM_TITLES = {
    dashboard: ["Resumen General del Día", "Sede C.C. Barrio Chino (5 Cabinas) · Operación en tiempo real"],
    citas: ["Control de Citas Multi-Cabina", "Agenda sincronizada entre Web Online, WhatsApp y atención en galería"],
    ventas: ["Registro de Ventas Diarias & Caja", "Servicios en cabina + tienda online con arqueo por método de pago"],
    clientes: ["Clientes Frecuentes & Fidelización", "Historial clínico, Puntos Betty y reactivación por WhatsApp"],
    personal: ["Personal Especialista & Comisiones", "Productividad y liquidación diaria por especialista"],
    inventario: ["Productos Clínicos & Control de Stock", "Sincronización automática con la Tienda Online"]
  };

  function switchCrmTab(tab) {
    activeCrmTab = tab;
    document.querySelectorAll(".crm-nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.crmTab === tab);
    });
    document.querySelectorAll(".crm-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `crm-tab-${tab}`);
    });
    const [title, sub] = CRM_TITLES[tab] || CRM_TITLES.dashboard;
    document.getElementById("crm-page-title").textContent = title;
    document.getElementById("crm-page-subtitle").textContent = sub;
    renderAllCRM();
  }

  function renderAllCRM() {
    document.getElementById("nav-citas-count").textContent = state.appointments.length;
    renderCrmDashboard();
    renderCrmCitas();
    renderCrmVentas();
    renderCrmClientes();
    renderCrmStaff();
    renderCrmInventory();
    refreshIcons();
  }

  function renderCrmDashboard() {
    const totalRevenue = state.sales.reduce((sum, s) => sum + Number(s.amount), 0);
    const serviceRev = state.sales.filter((s) => s.type === "Servicio").reduce((sum, s) => sum + Number(s.amount), 0);
    const productRev = state.sales.filter((s) => s.type === "Producto").reduce((sum, s) => sum + Number(s.amount), 0);
    const webAppts = state.appointments.filter((a) => a.channel === "Web Online").length;
    const recurrentClients = state.clients.filter((c) => c.visits >= 3).length;
    const avgTicket = state.sales.length ? totalRevenue / state.sales.length : 0;

    document.getElementById("crm-kpi-grid").innerHTML = `
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Ventas del Día (Caja + Web)</span>
          <div class="kpi-icon"><i data-lucide="banknote"></i></div>
        </div>
        <div class="kpi-value">${fmtS(totalRevenue)}</div>
        <div class="kpi-foot">${fmtS(serviceRev)} servicios · ${fmtS(productRev)} productos</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Citas Agendadas Hoy</span>
          <div class="kpi-icon"><i data-lucide="calendar-check-2"></i></div>
        </div>
        <div class="kpi-value">${state.appointments.length}</div>
        <div class="kpi-foot">${webAppts} reservadas online con pago previo</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Clientes Recurrentes / Club</span>
          <div class="kpi-icon"><i data-lucide="heart-handshake"></i></div>
        </div>
        <div class="kpi-value">${recurrentClients} / ${state.clients.length}</div>
        <div class="kpi-foot">${Math.round((recurrentClients / Math.max(1, state.clients.length)) * 100)}% tasa de fidelización activa</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Ticket Promedio</span>
          <div class="kpi-icon"><i data-lucide="trending-up"></i></div>
        </div>
        <div class="kpi-value">${fmtS(avgTicket)}</div>
        <div class="kpi-foot">${state.sales.length} operaciones registradas hoy</div>
      </div>
    `;

    // Revenue by category bars
    const categories = ["Podología", "Fisio & Masajes", "Cosmiatría", "Cejas & Pestañas", "Tienda Productos"];
    const catTotals = categories.map((cat) => ({
      cat,
      total: state.sales.filter((s) => s.category === cat).reduce((sum, s) => sum + Number(s.amount), 0)
    }));
    const maxCat = Math.max(1, ...catTotals.map((c) => c.total));

    document.getElementById("crm-revenue-bars").innerHTML = catTotals
      .map((c) => {
        const pct = Math.round((c.total / maxCat) * 100);
        return `
        <div class="rev-bar-item">
          <div class="rev-bar-head">
            <span>${c.cat}</span>
            <span>${fmtS(c.total)}</span>
          </div>
          <div class="rev-bar-track">
            <div class="rev-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
      `;
      })
      .join("");

    // Payment method breakdown
    const methods = [
      { name: "Yape", color: "#742284" },
      { name: "Plin", color: "#00A896" },
      { name: "Tarjeta", color: "#1B326B" },
      { name: "Efectivo", color: "#0F9D58" }
    ];
    document.getElementById("crm-payment-breakdown").innerHTML = methods
      .map((m) => {
        const sum = state.sales.filter((s) => s.method === m.name).reduce((acc, s) => acc + Number(s.amount), 0);
        const count = state.sales.filter((s) => s.method === m.name).length;
        return `
        <div class="pay-row">
          <div class="pay-row-left">
            <span class="pay-dot" style="background:${m.color}"></span>
            <span>${m.name} <small style="color:var(--muted); font-weight:500;">(${count} ops)</small></span>
          </div>
          <span class="pay-row-val">${fmtS(sum)}</span>
        </div>
      `;
      })
      .join("");

    // Upcoming appointments preview
    document.getElementById("dash-upcoming-tbody").innerHTML = state.appointments
      .slice(0, 5)
      .map(
        (a) => `
      <tr class="${a.isNew ? "row-new-sync" : ""}">
        <td><strong>${a.time}</strong></td>
        <td><strong>${a.clientName}</strong><br/><small style="color:var(--muted)">${a.clientPhone}</small></td>
        <td>${a.serviceName}</td>
        <td><strong>${a.cabin}</strong><br/><small style="color:var(--muted)">${a.staffName}</small></td>
        <td><span class="status-pill ${a.channel === "Web Online" ? "st-web" : "st-pendiente"}">${a.channel}</span><br/><small>${a.paymentMethod} ${a.paid ? "· Pagado" : "· Por cobrar"}</small></td>
        <td><span class="status-pill ${statusClass(a.status)}">${a.status}</span></td>
      </tr>
    `
      )
      .join("");

    // Smart alerts
    const lowStock = state.products.filter((p) => p.stock <= p.minStock);
    const alertsHtml = [];
    lowStock.forEach((p) => {
      alertsHtml.push(`
        <div class="alert-item warn">
          <strong>Stock bajo: ${p.name}</strong>
          <span>Quedan ${p.stock} unidades (mínimo recomendado: ${p.minStock}). Reponer para venta en tienda.</span>
        </div>
      `);
    });
    alertsHtml.push(`
      <div class="alert-item gold">
        <strong>Seguimiento VIP: Jorge Luis Espinoza</strong>
        <span>25 días desde su último control de Pie Diabético. Enviar recordatorio WhatsApp para agendar control mensual.</span>
      </div>
      <div class="alert-item">
        <strong>Oportunidad Clubes Ciclistas</strong>
        <span>2 atletas atendidos esta semana. Activar envío de promo Descarga Muscular fin de semana.</span>
      </div>
    `);
    document.getElementById("crm-smart-alerts").innerHTML = alertsHtml.join("");
  }

  function statusClass(st) {
    if (st === "Confirmada") return "st-confirmada";
    if (st === "En Atención") return "st-en-atencion";
    if (st === "Completada") return "st-completada";
    return "st-pendiente";
  }

  function renderCrmCitas() {
    const tbody = document.getElementById("crm-citas-tbody");
    if (!tbody) return;

    const list = state.appointments.filter((a) => {
      const matchCabin = activeCabinFilter === "all" || a.cabin === activeCabinFilter;
      const matchStatus = activeStatusFilter === "all" || a.status === activeStatusFilter;
      return matchCabin && matchStatus;
    });

    tbody.innerHTML = list
      .map((a) => {
        let actionBtn = `<span style="color:var(--success); font-weight:700; font-size:12px;">✓ Finalizada</span>`;
        if (a.status === "Confirmada" || a.status === "Pendiente") {
          actionBtn = `<button class="btn btn-outline-navy btn-sm" data-appt-next="${a.id}">Iniciar Atención</button>`;
        } else if (a.status === "En Atención") {
          actionBtn = `<button class="btn btn-aqua btn-sm" data-appt-next="${a.id}">${a.paid ? "Completar" : "Cobrar & Completar"}</button>`;
        }
        return `
        <tr class="${a.isNew ? "row-new-sync" : ""}">
          <td><strong>${a.date}</strong> · ${a.time}<br/><small style="color:var(--muted)">${a.id}</small></td>
          <td><strong>${a.clientName}</strong><br/><small style="color:var(--muted)">${a.clientPhone}</small></td>
          <td>${a.serviceName}</td>
          <td><strong>${a.cabin}</strong><br/><small style="color:var(--muted)">${a.staffName}</small></td>
          <td><span class="status-pill ${a.channel === "Web Online" ? "st-web" : "st-pendiente"}">${a.channel}</span><br/><small>${a.paymentMethod} ${a.paid ? "✓ Pagado" : "· Pendiente"}</small></td>
          <td><strong>${fmtS(a.amount)}</strong></td>
          <td><span class="status-pill ${statusClass(a.status)}">${a.status}</span></td>
          <td>${actionBtn}</td>
        </tr>
      `;
      })
      .join("");
  }

  function advanceAppointment(apptId) {
    const apt = state.appointments.find((a) => a.id === apptId);
    if (!apt) return;

    if (apt.status === "Confirmada" || apt.status === "Pendiente") {
      apt.status = "En Atención";
      showToast("Cita en atención", `${apt.clientName} ingresó a ${apt.cabin} con ${apt.staffName}.`);
    } else if (apt.status === "En Atención") {
      apt.status = "Completada";
      if (!apt.paid) {
        apt.paid = true;
        const srv = state.services.find((s) => s.id === apt.serviceId);
        state.sales.unshift({
          id: `VTA-${2049 + state.sales.length}`,
          time: nowTime(),
          clientName: apt.clientName,
          concept: apt.serviceName,
          type: "Servicio",
          category: srv ? srv.categoryLabel : "Podología",
          staffId: apt.staffId,
          staffName: apt.staffName,
          method: apt.paymentMethod || "Efectivo",
          channel: "Caja Local",
          amount: apt.amount,
          isNew: true
        });
        upsertClient(apt.clientName, apt.clientPhone, "", apt.serviceName, apt.amount, "Atención completada en cabina.");
        showToast("Servicio cobrado y cerrado", `Se registró ${fmtS(apt.amount)} (${apt.paymentMethod}) en Ventas Diarias.`);
      } else {
        showToast("Cita completada", `${apt.clientName} finalizó su sesión en ${apt.cabin}.`);
      }
    }
    saveState();
    renderAllCRM();
  }

  function renderCrmVentas() {
    const total = state.sales.reduce((s, x) => s + Number(x.amount), 0);
    const srvTotal = state.sales.filter((x) => x.type === "Servicio").reduce((s, x) => s + Number(x.amount), 0);
    const prdTotal = state.sales.filter((x) => x.type === "Producto").reduce((s, x) => s + Number(x.amount), 0);
    const digitalTotal = state.sales.filter((x) => x.method !== "Efectivo").reduce((s, x) => s + Number(x.amount), 0);

    document.getElementById("sales-summary-strip").innerHTML = `
      <div class="kpi-card"><span class="kpi-label">Total Caja del Día</span><div class="kpi-value">${fmtS(total)}</div></div>
      <div class="kpi-card"><span class="kpi-label">Ingresos por Servicios</span><div class="kpi-value">${fmtS(srvTotal)}</div></div>
      <div class="kpi-card"><span class="kpi-label">Venta de Productos</span><div class="kpi-value">${fmtS(prdTotal)}</div></div>
      <div class="kpi-card"><span class="kpi-label">Cobros Digitales (Yape/Plin/Tarj.)</span><div class="kpi-value">${fmtS(digitalTotal)}</div></div>
    `;

    const list = state.sales.filter((v) => {
      const matchMethod = activeSalesMethod === "all" || v.method === activeSalesMethod;
      const q = activeSalesQuery.toLowerCase();
      const matchQuery = !q || v.clientName.toLowerCase().includes(q) || v.concept.toLowerCase().includes(q);
      return matchMethod && matchQuery;
    });

    document.getElementById("crm-ventas-tbody").innerHTML = list
      .map(
        (v) => `
      <tr class="${v.isNew ? "row-new-sync" : ""}">
        <td><strong>${v.time}</strong><br/><small style="color:var(--muted)">${v.id}</small></td>
        <td><strong>${v.clientName}</strong></td>
        <td>${v.concept}<br/><small style="color:var(--muted)">${v.channel}</small></td>
        <td><span class="status-pill ${v.type === "Producto" ? "st-en-atencion" : "st-confirmada"}">${v.type}</span></td>
        <td>${v.staffName}</td>
        <td><strong>${v.method}</strong></td>
        <td><strong style="color:var(--navy)">${fmtS(v.amount)}</strong></td>
      </tr>
    `
      )
      .join("");
  }

  function tierClass(tier) {
    if (tier === "VIP Oro") return "tier-oro";
    if (tier === "Club Ciclista") return "tier-ciclista";
    if (tier === "Frecuente") return "tier-frecuente";
    return "tier-nuevo";
  }

  function renderCrmClientes() {
    const list = state.clients.filter((c) => {
      const matchTier = activeClientTier === "all" || c.tier === activeClientTier;
      const q = activeClientQuery.toLowerCase();
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
      return matchTier && matchQ;
    });

    document.getElementById("crm-clientes-tbody").innerHTML = list
      .map(
        (c) => `
      <tr>
        <td><strong>${c.name}</strong><br/><small style="color:var(--muted)">${c.phone}</small></td>
        <td><span class="tier-pill ${tierClass(c.tier)}">${c.tier}</span></td>
        <td><strong>${c.visits}</strong> ${c.visits === 1 ? "visita" : "visitas"}</td>
        <td><strong>${fmtS(c.totalSpent)}</strong></td>
        <td><strong style="color:var(--aqua-dark)">${c.points} pts</strong></td>
        <td>${c.lastVisit}<br/><small style="color:var(--muted)">${c.lastService}</small></td>
        <td><button class="btn btn-outline-navy btn-sm" data-open-client="${c.id}">Ver Ficha 360°</button></td>
      </tr>
    `
      )
      .join("");
  }

  function openClientDrawer(clientId) {
    const client = state.clients.find((c) => c.id === clientId);
    if (!client) return;

    document.getElementById("client-drawer-name").textContent = client.name;
    const waText = encodeURIComponent(
      `¡Hola ${client.name.split(" ")[0]}! Te saludamos de Salud & Belleza Spa Betty (C.C. Barrio Chino). Tienes ${client.points} Puntos Betty acumulados y nos encantaría consentirte en tu próxima visita. ¿Deseas reservar tu horario esta semana?`
    );

    document.getElementById("client-drawer-body").innerHTML = `
      <div style="margin-bottom:14px; display:flex; align-items:center; justify-content:space-between;">
        <span class="tier-pill ${tierClass(client.tier)}">${client.tier}</span>
        <span style="font-size:13px; color:var(--muted);">${client.phone} · ${client.email}</span>
      </div>
      <div class="c360-stats">
        <div class="c360-stat"><strong>${client.visits}</strong><span>Visitas</span></div>
        <div class="c360-stat"><strong>${fmtS(client.totalSpent)}</strong><span>Acumulado</span></div>
        <div class="c360-stat"><strong style="color:var(--aqua-dark)">${client.points}</strong><span>Puntos Betty</span></div>
      </div>
      <div class="c360-box">
        <strong style="display:block; color:var(--navy); margin-bottom:4px;">Notas Clínicas &amp; Preferencias</strong>
        <p style="margin:0; color:var(--muted);">${client.notes}</p>
      </div>
      <a href="https://wa.me/51${client.phone.replace(/\D/g, "")}?text=${waText}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-full" style="margin-bottom:18px;">
        <i data-lucide="message-circle"></i>
        <span>Enviar Recordatorio / Promo por WhatsApp</span>
      </a>
      <h4 style="margin:0 0 8px; color:var(--navy); font-size:14px;">Historial de Atenciones y Compras</h4>
      <div>
        ${client.history
          .map(
            (h) => `
          <div class="c360-history-item">
            <div><strong>${h.item}</strong><br/><small style="color:var(--muted)">${h.date}</small></div>
            <strong style="color:var(--navy)">${fmtS(h.amount)}</strong>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    openDrawer("drawer-client");
    refreshIcons();
  }

  function renderCrmStaff() {
    document.getElementById("crm-staff-grid").innerHTML = state.staff
      .map((st) => {
        const staffSales = state.sales.filter((v) => v.staffId === st.id);
        const generated = staffSales.reduce((sum, v) => sum + Number(v.amount), 0);
        const apptsCount = state.appointments.filter((a) => a.staffId === st.id).length;
        const commission = generated * st.commissionRate;
        return `
        <article class="staff-card">
          <div class="staff-head">
            <div class="staff-avatar">${st.initials}</div>
            <div>
              <h3>${st.name}</h3>
              <span>${st.role} · <strong>${st.cabin}</strong></span>
            </div>
          </div>
          <div class="staff-metrics">
            <div><strong>${apptsCount}</strong><span>Citas Hoy</span></div>
            <div><strong>${fmtS(generated)}</strong><span>Facturado</span></div>
            <div><strong style="color:var(--aqua-dark)">${fmtS(commission)}</strong><span>Comisión (${Math.round(st.commissionRate * 100)}%)</span></div>
          </div>
        </article>
      `;
      })
      .join("");
  }

  function renderCrmInventory() {
    document.getElementById("crm-inventory-tbody").innerHTML = state.products
      .map((p) => {
        const low = p.stock <= p.minStock;
        return `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.category}</td>
          <td><strong>${fmtS(p.price)}</strong></td>
          <td><strong style="font-size:15px;">${p.stock} unid.</strong></td>
          <td><span class="stock-pill ${low ? "low" : ""}">${low ? "Reponer Pronto" : "Stock Saludable"}</span></td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-outline-navy btn-sm" data-stock-delta="${p.id}:-1">−1</button>
              <button class="btn btn-aqua btn-sm" data-stock-delta="${p.id}:5">+5 Reponer</button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  /* =========================================================
     CRM MODALS (POS SALE & NEW INTERNAL APPOINTMENT)
  ========================================================= */
  function openPosModal() {
    const staffSel = document.getElementById("pos-staff");
    staffSel.innerHTML = state.staff.map((st) => `<option value="${st.id}">${st.name}</option>`).join("");
    populatePosItems();
    openModal("modal-pos");
  }

  function populatePosItems() {
    const type = document.getElementById("pos-type").value;
    const itemSel = document.getElementById("pos-item");
    const list = type === "Servicio" ? state.services : state.products;
    itemSel.innerHTML = list.map((x) => `<option value="${x.id}">${x.name} — ${fmtS(x.price)}</option>`).join("");
    syncPosAmount();
  }

  function syncPosAmount() {
    const type = document.getElementById("pos-type").value;
    const id = document.getElementById("pos-item").value;
    const list = type === "Servicio" ? state.services : state.products;
    const found = list.find((x) => x.id === id);
    if (found) document.getElementById("pos-amount").value = found.price.toFixed(2);
  }

  function handlePosSubmit(e) {
    e.preventDefault();
    const clientName = document.getElementById("pos-client").value.trim() || "Cliente al Paso";
    const type = document.getElementById("pos-type").value;
    const itemId = document.getElementById("pos-item").value;
    const staffId = document.getElementById("pos-staff").value;
    const method = document.getElementById("pos-method").value;
    const amount = parseFloat(document.getElementById("pos-amount").value) || 0;

    const staff = state.staff.find((s) => s.id === staffId) || state.staff[0];
    let concept = "";
    let category = "Tienda Productos";

    if (type === "Servicio") {
      const srv = state.services.find((s) => s.id === itemId);
      concept = srv ? srv.name : "Servicio en Cabina";
      category = srv ? srv.categoryLabel : "Podología";
    } else {
      const prd = state.products.find((p) => p.id === itemId);
      concept = prd ? prd.name : "Producto";
      if (prd && prd.stock > 0) prd.stock -= 1;
    }

    state.sales.unshift({
      id: `VTA-${2049 + state.sales.length}`,
      time: nowTime(),
      clientName,
      concept,
      type,
      category,
      staffId: staff.id,
      staffName: staff.name,
      method,
      channel: "Caja Local",
      amount,
      isNew: true
    });

    upsertClient(clientName, "", "", concept, amount, "Venta registrada en caja local.");
    saveState();
    renderProducts();
    renderAllCRM();
    closeModal("modal-pos");
    document.getElementById("pos-form").reset();
    showToast("Venta registrada en Caja", `${clientName} · ${concept} (${fmtS(amount)} vía ${method}).`);
  }

  function openCrmApptModal() {
    document.getElementById("ca-service").innerHTML = state.services
      .map((s) => `<option value="${s.id}">${s.name} — ${fmtS(s.price)} (${s.cabin})</option>`)
      .join("");
    document.getElementById("ca-staff").innerHTML = state.staff
      .filter((st) => st.id !== "stf-beatriz")
      .map((st) => `<option value="${st.id}">${st.name} (${st.cabin})</option>`)
      .join("");
    openModal("modal-crm-appt");
  }

  function handleCrmApptSubmit(e) {
    e.preventDefault();
    const clientName = document.getElementById("ca-client").value.trim();
    const clientPhone = document.getElementById("ca-phone").value.trim();
    const srvId = document.getElementById("ca-service").value;
    const srv = state.services.find((s) => s.id === srvId);
    const time = document.getElementById("ca-time").value;
    const channel = document.getElementById("ca-channel").value;
    const staffId = document.getElementById("ca-staff").value;
    const staff = state.staff.find((s) => s.id === staffId);

    state.appointments.unshift({
      id: `APT-${107 + state.appointments.length}`,
      date: "Hoy",
      time,
      clientName,
      clientPhone,
      serviceId: srv.id,
      serviceName: srv.name,
      cabin: srv.cabin,
      staffId: staff.id,
      staffName: staff.name,
      channel,
      paymentMethod: "Efectivo",
      paid: false,
      amount: srv.price,
      status: "Confirmada",
      isNew: true
    });

    saveState();
    renderAllCRM();
    closeModal("modal-crm-appt");
    document.getElementById("crm-appt-form").reset();
    showToast("Cita agendada", `${clientName} programado a las ${time} en ${srv.cabin}.`);
  }

  /* =========================================================
     MODAL & DRAWER HELPERS
  ========================================================= */
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
    refreshIcons();
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }
  function openDrawer(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
    refreshIcons();
  }
  function closeDrawer(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  /* =========================================================
     EVENT WIRING
  ========================================================= */
  function bindEvents() {
    // Mode switcher buttons
    document.querySelectorAll(".mode-btn, [data-switch-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode || btn.dataset.switchMode;
        if (mode) switchMode(mode);
      });
    });

    // Reset Demo
    document.getElementById("btn-reset-demo").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state = getInitialState();
      renderServices();
      renderProducts();
      updateCartUI();
      updateSyncBadge();
      renderAllCRM();
      showToast("Demo reiniciada", "Se restauraron todos los datos iniciales de Salud & Belleza Spa Betty.");
    });

    // Hero / Contact Book buttons
    ["btn-hero-book-top", "btn-hero-book", "btn-contact-book"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", () => openBookingModal());
    });

    // Quick specialty buttons in Hero
    document.querySelectorAll("[data-quick-cat]").forEach((btn) => {
      btn.addEventListener("click", () => openBookingModal(null, btn.dataset.quickCat));
    });

    // Pillar cards jump to services filter
    document.querySelectorAll("[data-filter-jump]").forEach((card) => {
      card.addEventListener("click", () => {
        activeServiceCat = card.dataset.filterJump;
        document.querySelectorAll("#service-filter-pills .filter-pill").forEach((p) => {
          p.classList.toggle("active", p.dataset.cat === activeServiceCat);
        });
        renderServices();
        document.getElementById("servicios").scrollIntoView({ behavior: "smooth" });
      });
    });

    // Service filter pills
    document.getElementById("service-filter-pills").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      activeServiceCat = btn.dataset.cat;
      document.querySelectorAll("#service-filter-pills .filter-pill").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      renderServices();
    });

    // Global delegated clicks (dynamic cards, tables, modals, swatches)
    document.addEventListener("click", (e) => {
      const bookBtn = e.target.closest("[data-book-service]");
      if (bookBtn) return openBookingModal(bookBtn.dataset.bookService);

      const addCartBtn = e.target.closest("[data-add-cart]");
      if (addCartBtn) return addToCart(addCartBtn.dataset.addCart);

      const decBtn = e.target.closest("[data-cart-dec]");
      if (decBtn) {
        const item = state.cart.find((i) => i.productId === decBtn.dataset.cartDec);
        if (item) {
          item.qty -= 1;
          if (item.qty <= 0) state.cart = state.cart.filter((i) => i.productId !== item.productId);
          saveState();
          updateCartUI();
        }
        return;
      }

      const incBtn = e.target.closest("[data-cart-inc]");
      if (incBtn) return addToCart(incBtn.dataset.cartInc);

      const closeModalBtn = e.target.closest("[data-close-modal]");
      if (closeModalBtn) return closeModal(closeModalBtn.dataset.closeModal);

      const closeDrawerBtn = e.target.closest("[data-close-drawer]");
      if (closeDrawerBtn) return closeDrawer(closeDrawerBtn.dataset.closeDrawer);

      const jumpCrm = e.target.closest("[data-jump-crm]");
      if (jumpCrm) return switchCrmTab(jumpCrm.dataset.jumpCrm);

      const apptNext = e.target.closest("[data-appt-next]");
      if (apptNext) return advanceAppointment(apptNext.dataset.apptNext);

      const openClient = e.target.closest("[data-open-client]");
      if (openClient) return openClientDrawer(openClient.dataset.openClient);

      const stockDelta = e.target.closest("[data-stock-delta]");
      if (stockDelta) {
        const [pid, deltaStr] = stockDelta.dataset.stockDelta.split(":");
        const prd = state.products.find((p) => p.id === pid);
        if (prd) {
          prd.stock = Math.max(0, prd.stock + Number(deltaStr));
          saveState();
          renderProducts();
          renderCrmInventory();
          renderCrmDashboard();
        }
        return;
      }

      const swatch = e.target.closest("[data-copy-hex]");
      if (swatch) {
        const hex = swatch.dataset.copyHex;
        if (navigator.clipboard) navigator.clipboard.writeText(hex).catch(() => {});
        showToast("Color copiado", `Código ${hex} listo para usar en diseño gráfico y señalética.`);
      }
    });

    // Cart Drawer open & checkout
    document.getElementById("btn-open-cart").addEventListener("click", () => openDrawer("drawer-cart"));
    document.getElementById("btn-cart-checkout").addEventListener("click", completeCartCheckout);

    // Booking Wizard controls
    document.getElementById("bk-service").addEventListener("change", syncBookingStaffAndSummary);
    document.getElementById("btn-bk-next-1").addEventListener("click", () => setBookingStep(2));
    document.getElementById("btn-bk-prev-2").addEventListener("click", () => setBookingStep(1));
    document.getElementById("btn-bk-next-2").addEventListener("click", () => {
      const name = document.getElementById("bk-name").value.trim();
      const phone = document.getElementById("bk-phone").value.trim();
      if (!name || !phone) {
        showToast("Completa tus datos", "Ingresa tu nombre y celular para confirmar tu cita.");
        return;
      }
      setBookingStep(3);
    });
    document.getElementById("btn-bk-prev-3").addEventListener("click", () => setBookingStep(2));
    document.getElementById("booking-form").addEventListener("submit", handleBookingSubmit);

    // Payment gateway method switcher
    document.querySelectorAll('input[name="bk-pay-method"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        document.querySelectorAll(".gw-method").forEach((lbl) => {
          lbl.classList.toggle("active", lbl.querySelector("input").checked);
        });
        const isCard = radio.value === "Tarjeta";
        document.getElementById("gw-yape-box").hidden = isCard;
        document.getElementById("gw-card-box").hidden = !isCard;
      });
    });

    // CRM Navigation & Filters
    document.querySelectorAll(".crm-nav-item").forEach((btn) => {
      btn.addEventListener("click", () => switchCrmTab(btn.dataset.crmTab));
    });

    document.getElementById("crm-cabin-filters").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      activeCabinFilter = btn.dataset.cabin;
      document.querySelectorAll("#crm-cabin-filters .filter-pill").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      renderCrmCitas();
    });

    document.getElementById("crm-status-filter").addEventListener("change", (e) => {
      activeStatusFilter = e.target.value;
      renderCrmCitas();
    });

    document.getElementById("sales-method-filters").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      activeSalesMethod = btn.dataset.method;
      document.querySelectorAll("#sales-method-filters .filter-pill").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      renderCrmVentas();
    });

    document.getElementById("sales-search-input").addEventListener("input", (e) => {
      activeSalesQuery = e.target.value;
      renderCrmVentas();
    });

    document.getElementById("client-tier-filters").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      activeClientTier = btn.dataset.tier;
      document.querySelectorAll("#client-tier-filters .filter-pill").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      renderCrmClientes();
    });

    document.getElementById("client-search-input").addEventListener("input", (e) => {
      activeClientQuery = e.target.value;
      renderCrmClientes();
    });

    // CRM Quick Action Modals
    document.getElementById("btn-crm-new-sale").addEventListener("click", openPosModal);
    document.getElementById("pos-type").addEventListener("change", populatePosItems);
    document.getElementById("pos-item").addEventListener("change", syncPosAmount);
    document.getElementById("pos-form").addEventListener("submit", handlePosSubmit);

    document.getElementById("btn-crm-new-appt").addEventListener("click", openCrmApptModal);
    document.getElementById("crm-appt-form").addEventListener("submit", handleCrmApptSubmit);
  }

  /* =========================================================
     INIT
  ========================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    renderServices();
    renderProducts();
    updateCartUI();
    updateSyncBadge();
    renderAllCRM();
    refreshIcons();
  });
})();
