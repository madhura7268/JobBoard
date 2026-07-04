// ===== Navigation =====

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));

  // Show selected section
  document.getElementById("section-" + sectionName).classList.add("active");
  document.getElementById("nav-" + sectionName).classList.add("active");

  // Load data when switching sections
  if (sectionName === "dashboard") loadStats();
  if (sectionName === "browse-jobs") loadJobs();
}

// ===== Dashboard =====

async function loadStats() {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    document.getElementById("stat-jobs").textContent = data.totalJobs;
    document.getElementById("stat-employers").textContent = data.totalEmployers;
    document.getElementById("stat-applications").textContent = data.totalApplications;
  } catch (err) {
    console.error("Failed to load stats:", err);
  }
}

// ===== Post Job =====

document.getElementById("post-job-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const messageEl = document.getElementById("post-job-message");
  messageEl.textContent = "";
  messageEl.className = "form-message";

  const companyName = document.getElementById("company-name").value.trim();
  const email = document.getElementById("company-email").value.trim();
  const title = document.getElementById("job-title").value.trim();
  const description = document.getElementById("job-description").value.trim();
  const location = document.getElementById("job-location").value.trim();
  const salary = document.getElementById("job-salary").value.trim();

  try {
    // Step 1: Create or find employer
    const employerRes = await fetch("/api/employers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, email }),
    });

    let employer;

    if (employerRes.status === 201) {
      employer = await employerRes.json();
    } else if (employerRes.status === 409) {
      // Employer already exists — fetch their ID by trying to post the job
      // We'll handle this by fetching all jobs and finding the employer ID
      // Simpler approach: re-use the email conflict to look up the employer
      const errData = await employerRes.json();

      // Fetch jobs to find existing employer ID
      const jobsRes = await fetch("/api/jobs");
      const jobs = await jobsRes.json();
      const match = jobs.find(
        (j) => j.employer.email.toLowerCase() === email.toLowerCase()
      );

      if (!match) {
        messageEl.textContent = errData.error + " But we could not retrieve your employer record. Please try a different email.";
        messageEl.classList.add("error");
        return;
      }

      employer = match.employer;
    } else {
      const errData = await employerRes.json();
      messageEl.textContent = errData.error || "Failed to create employer.";
      messageEl.classList.add("error");
      return;
    }

    // Step 2: Create job
    const jobRes = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, location, salary, employerId: employer.id }),
    });

    const jobData = await jobRes.json();

    if (jobRes.ok) {
      messageEl.textContent = "Job posted successfully!";
      messageEl.classList.add("success");
      document.getElementById("post-job-form").reset();
    } else {
      messageEl.textContent = jobData.error || "Failed to post job.";
      messageEl.classList.add("error");
    }
  } catch (err) {
    console.error(err);
    messageEl.textContent = "Something went wrong. Please try again.";
    messageEl.classList.add("error");
  }
});

// ===== Browse Jobs =====

let selectedJobId = null;

async function loadJobs() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = '<p class="placeholder-text">Loading jobs...</p>';

  // Make sure we show the list view
  showJobsListView();

  try {
    const res = await fetch("/api/jobs");
    const jobs = await res.json();

    if (jobs.length === 0) {
      container.innerHTML = '<p class="placeholder-text">No jobs available yet. Post one first!</p>';
      return;
    }

    container.innerHTML = "";

    jobs.forEach((job) => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        <div class="job-card-title">${escapeHtml(job.title)}</div>
        <div class="job-card-company">${escapeHtml(job.employer.companyName)}</div>
        <div class="job-card-meta">
          <span>📍 ${escapeHtml(job.location)}</span>
          <span>💰 ${escapeHtml(job.salary)}</span>
        </div>
        <div class="job-card-desc">${escapeHtml(job.description)}</div>
        <button class="btn btn-primary" onclick="openApplyForm(${job.id}, '${escapeHtml(job.title)}')">
          Apply
        </button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="placeholder-text">Failed to load jobs.</p>';
  }
}

function openApplyForm(jobId, jobTitle) {
  selectedJobId = jobId;
  document.getElementById("apply-job-title-display").textContent = "Applying for: " + jobTitle;
  document.getElementById("apply-message").textContent = "";
  document.getElementById("apply-message").className = "form-message";
  document.getElementById("apply-form").reset();

  document.getElementById("jobs-list-view").style.display = "none";
  document.getElementById("apply-view").style.display = "block";
}

function cancelApply() {
  selectedJobId = null;
  showJobsListView();
}

function showJobsListView() {
  document.getElementById("jobs-list-view").style.display = "block";
  document.getElementById("apply-view").style.display = "none";
}

document.getElementById("apply-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const messageEl = document.getElementById("apply-message");
  messageEl.textContent = "";
  messageEl.className = "form-message";

  const candidateName = document.getElementById("apply-name").value.trim();
  const candidateEmail = document.getElementById("apply-email").value.trim();

  try {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateName, candidateEmail, jobId: selectedJobId }),
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.textContent = "Application submitted successfully!";
      messageEl.classList.add("success");
      document.getElementById("apply-form").reset();

      // Return to Browse Jobs after 2 seconds
      setTimeout(() => {
        selectedJobId = null;
        showSection("browse-jobs");
      }, 2000);
    } else {
      messageEl.textContent = data.error || "Failed to submit application.";
      messageEl.classList.add("error");
    }
  } catch (err) {
    console.error(err);
    messageEl.textContent = "Something went wrong. Please try again.";
    messageEl.classList.add("error");
  }
});

// ===== My Applications =====

async function loadApplications() {
  const email = document.getElementById("lookup-email").value.trim();
  const container = document.getElementById("applications-container");

  if (!email) {
    container.innerHTML = '<p class="placeholder-text">Please enter your email address.</p>';
    return;
  }

  container.innerHTML = '<p class="placeholder-text">Loading...</p>';

  try {
    const res = await fetch(`/api/applications?email=${encodeURIComponent(email)}`);
    const data = await res.json();

    if (!res.ok) {
      container.innerHTML = `<p class="placeholder-text">${data.error}</p>`;
      return;
    }

    if (data.length === 0) {
      container.innerHTML = '<p class="placeholder-text">No applications found for this email.</p>';
      return;
    }

    container.innerHTML = `
      <div class="applications-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (app, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(app.job.title)}</td>
                <td>${escapeHtml(app.job.employer.companyName)}</td>
                <td><span class="status-badge">${escapeHtml(app.status)}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="placeholder-text">Failed to load applications.</p>';
  }
}

// ===== Utility =====

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// ===== Initialize =====
loadStats();
