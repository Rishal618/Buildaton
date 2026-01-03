
const stages = ["Advisor", "HOD", "Principal", "completed"];


function getApps() {
  return JSON.parse(localStorage.getItem("applications")) || [];
}


function saveApps(apps) {
  localStorage.setItem("applications", JSON.stringify(apps));
}


function updateStatus(id, action) {
  let apps = getApps();

  apps = apps.map(app => {
    if (app.id !== id) {
      return app;
    }

    if (app.status === "Rejected" || app.status === "Approved") {
      return app; 
    }

    if (action === "Rejected") {
      const originalStage = app.stage;
      return {...app, 
      stage: "completed", 
      status: "Rejected", 
      rejectedAtStage: originalStage,
      updatedAt: Date.now()};
    }

    const currentIndex = stages.indexOf(app.stage);
    if (currentIndex === -1) return app; 

    const nextStage = stages[currentIndex + 1] || "completed";
    const status = nextStage === "completed" ? "Approved" : "Pending";

    return {...app, stage: nextStage, status, updatedAt: Date.now()};
  });

  saveApps(apps);

  const appDiv = document.getElementById(`app-${id}`); if (appDiv) { 
    appDiv.remove(); 
    const container = document.getElementById("applications"); 
    if (container && container.children.length === 0) { 
      container.innerHTML = "<p class=\"no-applications\">No applications available.</p>";
  } 
  }

  if (typeof loadHODHistory === "function") { loadHODHistory(); }
  if (typeof loadAdvisorHistory === "function") { loadAdvisorHistory(); }
  if (typeof loadPrincipalHistory === "function") { loadPrincipalHistory(); }
}


function renderApplications(stage, containerId) {
  const apps = getApps();
  const container = document.getElementById(containerId);

  if (!container) return; 

  const stageApps = apps.filter(a => a.stage === stage);

  if (stageApps.length === 0) {
    container.innerHTML = "<div class=\"no-applications\">No applications available.</div>";
    return;
  }

  container.innerHTML = stageApps.map(a => `
    <div class="principal-screen-div" id="app-${a.id}">
            <p class="principal-screen-from"><strong>From:</strong></p><br>
            <p class="principal-screen-from-user">${a.name}</p><br>
            <p class="principal-screen-from-user">${a.department} &nbsp; ${a.year}</p><br>
            
            <p class="principal-screen-from-user">${a.email}</p><br>
            <p class="principal-screen-from-user">${a.phoneNumber}</p><br>
            <hr><br>
            <p class="principal-screen-subject"><strong>Subject:</strong> ${a.subject}</p><br>
            <p class="principal-screen-body">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${a.body}</p>
          <div class="approve-reject-button-div">
            <button onclick="updateStatus(${a.id}, 'Approved')" class="approve-button">
            ${stage === "Advisor" ? "Send to HOD" : stage === "HOD" ? "Send to Principal" : "Approve"}
            </button>
            <button onclick="updateStatus(${a.id}, 'Rejected')" class="reject-button">Reject</button>
          </div>
        </div>
        `).join("");
  }
