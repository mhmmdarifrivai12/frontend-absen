const API_URL = 'https://absensi-app-tawny.vercel.app/api/admin'; // Sesuaikan dengan alamat backend Anda
const token = localStorage.getItem('token');

// ✅ Cek autentikasi, jika tidak ada token, redirect ke login
if (!token) {
    alert('Anda harus login terlebih dahulu!');
    window.location.href = '../index.html';
}

// ✅ Mengecek apakah user sudah login
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
    }
}

// ✅ Logout user
function logout() {
    localStorage.removeItem('token');
    alert('Logout berhasil!');
    window.location.href = '../index.html';
}

// ✅ Memuat daftar kelas ke dalam dropdown
function loadClasses() {
    fetch(`${API_URL}/classes`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.classes) {
            const classSelect = document.getElementById("class-select");
            const classDropdown = document.getElementById("class-dropdown");
            const classSelectTeacher = document.getElementById("teacher-class-select");
            
            classSelect.innerHTML = '<option value="">Pilih Kelas</option>';
            classDropdown.innerHTML = '<option value="">Pilih Kelas</option>';
            classSelectTeacher.innerHTML = '<option value="">Pilih Kelas</option>';

            data.classes.forEach(cls => {
                const option1 = document.createElement("option");
                option1.value = cls.id;
                option1.textContent = cls.name;
                classSelect.appendChild(option1);

                const option2 = document.createElement("option");
                option2.value = cls.id;
                option2.textContent = cls.name;
                classDropdown.appendChild(option2);

                const option = document.createElement("option");
                option.value = cls.id;
                option.textContent = cls.name;
                classSelectTeacher.appendChild(option);            });
        }
    })
    .catch(error => console.error("Gagal memuat kelas:", error));
}

// ✅ Menampilkan daftar siswa berdasarkan kelas yang dipilih
function showStudentsByClass() {
    const classId = document.getElementById("class-dropdown").value;
    const studentList = document.getElementById("student-list");

    studentList.innerHTML = ""; // Hapus daftar sebelumnya

    if (!classId) {
        studentList.innerHTML = "<li class='list-group-item text-danger'>Silakan pilih kelas</li>";
        return;
    }

    fetch(`${API_URL}/classes/${classId}/students`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            studentList.innerHTML = `<li class='list-group-item text-warning'>${data.message}</li>`;
            return;
        }

        data.forEach(student => {
            let li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${student.name} (NIS: ${student.nis})`;
            studentList.appendChild(li);
        });
    })
    .catch(error => console.error("Gagal mengambil daftar siswa:", error));
}

// ✅ Fungsi untuk menambahkan kelas
function addClass() {
    const className = document.getElementById('class-name').value;
    if (!className) {
        alert('Nama kelas tidak boleh kosong!');
        return;
    }

    fetch(`${API_URL}/classes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: className })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('class-name').value = '';
        loadClasses(); // Reload kelas setelah menambah
    })
    .catch(error => console.error('Error:', error));
}

// ✅ Fungsi untuk menambahkan mata pelajaran
function addSubject() {
    const subjectName = document.getElementById('subject-name').value;
    if (!subjectName) {
        alert('Nama mata pelajaran tidak boleh kosong!');
        return;
    }

    fetch(`${API_URL}/subjects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: subjectName })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('subject-name').value = '';
    })
    .catch(error => console.error('Error:', error));
}

// ✅ Menambahkan siswa baru
function addStudent() {
    const name = document.getElementById("student-name").value;
    const nis = document.getElementById("student-nis").value;
    const classId = document.getElementById("class-select").value;

    if (!name || !nis || !classId) {
        alert("Semua kolom harus diisi!");
        return;
    }

    fetch(`${API_URL}/student`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, nis, class_id: classId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Siswa berhasil ditambahkan") {
            alert("Siswa berhasil ditambahkan!");
            document.getElementById("student-name").value = "";
            document.getElementById("student-nis").value = "";
            document.getElementById("class-select").value = "";
        } else {
            alert("Gagal menambahkan siswa: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}

// Fungsi untuk memuat daftar mata pelajaran
function loadSubjects() {
    fetch(`${API_URL}/subjects`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const subjectTableBody = document.getElementById("subject-table-body");
        subjectTableBody.innerHTML = ""; // Kosongkan tabel sebelum menampilkan data baru

        const subjectSelect = document.getElementById("teacher-subject-select");
        subjectSelect.innerHTML = '<option value="">Pilih Mata Pelajaran</option>';

        if (data.length > 0) {
            data.forEach((subject, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${subject.name}</td>
                `;
                subjectTableBody.appendChild(row);

                const option = document.createElement("option");
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
        } else {
            subjectTableBody.innerHTML = `<tr><td colspan="2" class="text-center">Tidak ada mata pelajaran tersedia</td></tr>`;
        }
    })
    .catch(error => console.error("Gagal memuat mata pelajaran:", error));
}


// Fungsi untuk memuat daftar guru dari API
function loadTeachers() {
    fetch(`${API_URL}/teachers`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const teacherSelect = document.getElementById("teacher-select");
        teacherSelect.innerHTML = '<option value="">Pilih Guru</option>';
        data.forEach(teacher => {
            teacherSelect.innerHTML += `<option value="${teacher.id}">${teacher.username}</option>`;
        });
    })
    .catch(error => console.error("Gagal memuat guru:", error));
}

// Fungsi untuk menetapkan guru ke kelas & mata pelajaran
function assignTeacher() {
    const teacherSelect = document.getElementById("teacher-select");
    const classSelect = document.getElementById("teacher-class-select");
    const subjectSelect = document.getElementById("teacher-subject-select");
    const daySelect = document.getElementById("day-select");
    const startTime = document.getElementById("start-time");
    const durationSelect = document.getElementById("duration-select");

    const teacher_id = teacherSelect.value.trim();
    const class_id = classSelect.value.trim();
    const subject_id = subjectSelect.value.trim();
    const teaching_day = daySelect.value.trim();
    const start_time = startTime.value.trim();
    const duration = durationSelect.value.trim();

    if (!teacher_id || !class_id || !subject_id || !teaching_day || !start_time || !duration) {
        alert("Harap isi semua bidang sebelum menetapkan guru!");
        return;
    }

    fetch(`${API_URL}/assign-teacher`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ teacher_id, class_id, subject_id, teaching_day, start_time, duration })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Guru berhasil ditetapkan ke kelas dan mata pelajaran!");
            // Reset form
            teacherSelect.value = "";
            classSelect.value = "";
            subjectSelect.value = "";
            daySelect.value = "";
            startTime.value = "";
            durationSelect.value = "";
        } else {
            alert(`Gagal menetapkan guru: ${data.message}`);
        }
    })
    .catch(error => {
        console.error("Gagal menetapkan guru:", error);
        alert("Terjadi kesalahan saat menetapkan guru, coba lagi.");
    });
}

function loadTeacherSchedule() {
    const token = localStorage.getItem("token");

    fetch("https://absensi-app-tawny.vercel.app/api/admin/teachers-schedule", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById("assigned-teachers-body");
        tableBody.innerHTML = ""; // Kosongkan tabel sebelum menampilkan data

        if (data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='7' class='text-center text-warning'>Jadwal guru belum tersedia</td></tr>";
            return;
        }

        // 🔹 Grupkan data berdasarkan nama guru
        const groupedData = {};
        data.forEach(schedule => {
            if (!groupedData[schedule.teacher_name]) {
                groupedData[schedule.teacher_name] = [];
            }
            groupedData[schedule.teacher_name].push(schedule);
        });

        // 🔹 Looping untuk menampilkan data di tabel
        let rowIndex = 1;
        Object.keys(groupedData).forEach((teacherName) => {
            const schedules = groupedData[teacherName];
            const rowspan = schedules.length; // Jumlah baris yang digabungkan
            
            schedules.forEach((schedule, index) => {
                let row = document.createElement("tr");

                // 🔹 Merge hanya di baris pertama untuk nama guru
                if (index === 0) {
                    row.innerHTML += `
                        <td rowspan="${rowspan}">${rowIndex++}</td>
                        <td rowspan="${rowspan}">${teacherName}</td>
                    `;
                }

                // 🔹 Isi data kelas, mata pelajaran, hari, jam mulai, dan durasi
                row.innerHTML += `
                    <td>${schedule.class_name}</td>
                    <td>${schedule.subject_name}</td>
                    <td>${schedule.teaching_day}</td>
                    <td>${schedule.start_time}</td>
                    <td>${schedule.duration} Menit</td>
                `;

                tableBody.appendChild(row);
            });
        });
    })
    .catch(error => console.error("Gagal mengambil jadwal guru:", error));
}





document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    loadClasses();
    loadSubjects();
    assignTeacher();
    loadTeachers();
    loadTeacherSchedule();

});
