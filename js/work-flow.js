
async function fetchApps() {
  const token = localStorage.getItem('token');
  const resp = await fetch('http://localhost:4000/api/applications', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await resp.json();
}



async function updateStatus(id, action) {
  const token = localStorage.getItem('token');

  const resp = await fetch(`http://localhost:4000/api/applications/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ action })
  });

  const updated = await resp.json();
  if (!resp.ok) {
    alert(updated.error || 'Update failed');
    return;
  }

  // Re-render your lists
  loadAdvisorHistory?.();
  loadHODHistory?.();
  loadPrincipalHistory?.();
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
