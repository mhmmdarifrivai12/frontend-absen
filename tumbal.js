document.addEventListener('DOMContentLoaded', function () {
    const classSelect = document.getElementById('classSelect');
    const dateSelect = document.getElementById('dateSelect');
    const attendanceTable = document.getElementById('attendanceTable');

    // Fungsi untuk mengambil data kelas
    function loadClasses() {
        fetch('https://absensi-app-tawny.vercel.app/api/admin/classes')
            .then(response => response.json())
            .then(data => {
                if (data.classes && data.classes.length > 0) {
                    data.classes.forEach(cls => {
                        const option = document.createElement('option');
                        option.value = cls.id;
                        option.textContent = cls.name;
                        classSelect.appendChild(option);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching classes:', error);
            });
    }

    // Fungsi untuk mengambil data absensi berdasarkan kelas dan tanggal
    function loadAttendance(classId, date) {
        fetch(`https://absensi-app-tawny.vercel.app/api/public/attendance/${classId}/${date}`)
            .then(response => response.json())
            .then(data => {
                if (data.attendance && data.attendance.length > 0) {
                    let tableHtml = '';
                    data.attendance.forEach(teacherSubject => {
                        tableHtml += `
                            <h3>Guru: ${teacherSubject.teacher_name} - Mata Pelajaran: ${teacherSubject.subject_name}</h3>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Nama Siswa</th>
                                        <th>Tanggal</th>
                                        <th>Hari</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;

                        teacherSubject.attendance.forEach(record => {
                            tableHtml += `
                                <tr>
                                    <td>${record.student_name}</td>
                                    <td>${record.date}</td>
                                    <td>${record.day}</td>
                                    <td>${record.status}</td>
                                </tr>
                            `;
                        });

                        tableHtml += `</tbody></table>`;
                    });

                    attendanceTable.innerHTML = tableHtml;
                } else {
                    attendanceTable.innerHTML = '<p>No attendance records found for this class and date.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching attendance:', error);
                attendanceTable.innerHTML = '<p>Error fetching attendance data.</p>';
            });
    }

    // Event listener saat memilih kelas dan tanggal
    classSelect.addEventListener('change', function () {
        const classId = classSelect.value;
        const date = dateSelect.value;
        if (classId && date) {
            loadAttendance(classId, date);
        }
    });

    dateSelect.addEventListener('change', function () {
        const classId = classSelect.value;
        const date = dateSelect.value;
        if (classId && date) {
            loadAttendance(classId, date);
        }
    });

    // Memuat daftar kelas saat halaman dimuat
    loadClasses();
});
