// for authenticate

let currentUser = null;
auth.onAuthStateChanged(user => {
    getTodos();
})

// for logout
const logout = document.getElementById('logout').addEventListener('click', e => {
    e.preventDefault();
    auth.signOut();
    window.location.replace('index.html');
})


const addTask = document.getElementById('add-task');

addTask.addEventListener('click', function addData(e) {
    e.preventDefault();
    let head = document.getElementById('task').value;
    let content = document.getElementById('task-data').value;
    let date = document.getElementById('task-date').value;

    // console.log(`The task Heading: ${head}
    // \nTask data:\n${content}
    // \nDeadline: ${date}`);

    if (head === '' || content === '' || date === '') {
        alert('Please enter all values (Heading, Date, Description) ');
    } else {
        // Adding data to FireBase
        db.collection('alltodos').doc(currentUser.uid).collection('todos').add({
            title: head,
            content: content,
            date: date
        })
        document.getElementById('add-task-form').reset();

    }


})

function renderList(doc) {
    const targetDiv = document.createElement('div');
    targetDiv.className = 'data';

    targetDiv.setAttribute('data-id', `${doc.id}`);

    const status = document.createElement('div');
    status.className = 'status';

    const btn = document.createElement('div');
    btn.className = 'btn';

    const targetSpan = document.createElement('span');
    targetSpan.setAttribute('id', 'text');
    targetSpan.textContent = doc.data().title;
    const targetDate = document.createElement('span');
    targetDate.setAttribute('class', 'deadline');
    targetDate.textContent = doc.data().date;

    const editBtn = document.createElement('button');
    editBtn.setAttribute('id', 'edit');
    editBtn.textContent = 'edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('id', 'delete');
    deleteBtn.textContent = 'delete';

    const desc = document.createElement('textarea');
    desc.setAttribute('cols', '50');
    desc.setAttribute('rows', '5');
    desc.setAttribute('id', `desc${doc.id}`);
    desc.className = 'desc';
    desc.textContent = doc.data().content;

    // Adding child nodes to NewDiv 
    targetDiv.appendChild(status);
    targetDiv.appendChild(btn);

    status.appendChild(targetSpan);
    status.appendChild(targetDate);

    btn.appendChild(editBtn);
    btn.appendChild(deleteBtn);

    // Adding child node to task-list
    document.querySelector('.task-list').appendChild(targetDiv);
    document.querySelector('.task-list').appendChild(desc);

    // Object for accordion
    let magic = {
        view: ''
    }
    // Adding eventListners 

    targetDiv.addEventListener('click', e => {
        let bool = e.isTrusted;
        //  console.log(bool);
        const id = e.target.getAttribute('data-id');
        const desc = document.getElementById(`desc${id}`);
        if (magic.view == 'false') {
            desc.style.display = 'none';
            magic.view = '';
        } else if (bool) {
            try {
                desc.style.display = 'block';
                magic.view = 'false';

            } catch (error) {
                console.log('Ignore this');
            }
        }

    })

    deleteBtn.addEventListener('click', e => {
        let decide = confirm('This item will be permanently deleted. Are you sure ?');
        if (decide) {
            let id = e.target.parentElement.parentElement.getAttribute('data-id');
            db.collection('alltodos').doc(currentUser.uid).collection('todos').doc(id).delete();
            console.log(id);
            targetDiv.remove();
            desc.remove();
        } else {
            window.location.reload();
        }

    })
    editBtn.addEventListener('click', e => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        modal1(id, doc.data().title, doc.data().content, doc.data().date);
    })
}


// Modal****************************************************
function modal1(updateId, head, content, date) {
    document.querySelector('.modal').style.display = 'flex';
    document.getElementById('Head').value = head;
    document.getElementById('Head').style.fontWeight = 'bold';
    document.getElementById('edit-task').value = content;
    document.getElementById('edit-date').value = date;

    const save = document.getElementById('save');
    save.addEventListener('click', function update() {
        db.collection('alltodos').doc(currentUser.uid).collection("todos").doc(updateId).update({
            title: document.getElementById('Head').value,

            content: document.getElementById('edit-task').value,

            date: document.getElementById('edit-date').value,
        });
        save.innerText = 'updated';

    });

}

// Modal exit
const exit = document.getElementById('exit');
exit.addEventListener('click', reset);

function reset() {
    document.querySelector('.modal').style.display = 'none';
    window.location.reload();

}



// Firebase************************************************

function getTodos() {
    currentUser = auth.currentUser;
    if (currentUser != null) {
        document.getElementById('user').textContent = currentUser.email;
    }
    console.log('current user', currentUser);
    db.collection('alltodos').doc(currentUser.uid).collection('todos').orderBy('title').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {
                renderList(change.doc);
            } else if (change.type == 'removed') {
                console.log('removed');

            } else if (change.type == 'modified') {
                console.log('modified');

            }
        });
    })

}

