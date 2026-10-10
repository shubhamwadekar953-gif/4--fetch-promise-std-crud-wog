const cl = console.log;

const stdForm = document.getElementById('stdForm')
const fName = document.getElementById('fName')
const regNo = document.getElementById('regNo')
const email = document.getElementById('email')
const contact = document.getElementById('contact')
const submitBtn = document.getElementById('submitBtn')
const updateBtn = document.getElementById('updateBtn')
const stList = document.getElementById('stList')
const spinner = document.getElementById('spinner')

const BASE_URL ='https://student-crud-26d0f-default-rtdb.firebaseio.com/std%20crud%20fetch%20promise%20wog%204th';
const STD_URL = `${BASE_URL}students.json`

function snackbar(msg, icon){
    if(typeof Swal!== 'undefined'){
        Swal.fire({ title: msg, icon: icon, timer: 2000 })
    }else{
        alert(msg)
    }
}

function showSpinner(){ spinner.classList.remove('d-none') }
function hideSpinner(){ spinner.classList.add('d-none') }

const state = { stdArr: [], editId: null }

//read-std
function onCreateStd(arr){
    let result = ``;
    arr.forEach(std=>{
        result += `
            <tr id="${std.id}">
                <td>${std.fName}</td>
                <td>${std.regNo}</td>
                <td>${std.email}</td>
                <td>${std.contact}</td>
                <td><i onclick="editStd(this)" class="btn btn-outline-success">Edit</i></td>
                <td><i onclick="deleteStd(this)" class="btn btn-outline-danger">Remove</i></td>
            </tr>`
    })
    stList.innerHTML = result;
}

function fetchStd(){
    showSpinner()
    fetch(STD_URL,{ method:"GET", headers:{ "Content-type":"application/json" }})
.then(res=>{ if(!res.ok) throw new Error(); return res.json() })
.then(data=>{
        if(data){
            for(const key in data){ data[key].id = key; state.stdArr.unshift(data[key]) }
            onCreateStd(state.stdArr)
        }
    })
.catch(err=>cl(err))
.finally(()=>hideSpinner())
}
fetchStd()

//create-std
function onStdAdd(eve){
    eve.preventDefault()
    let stdObj = {
        fName: fName.value,
        regNo: regNo.value,
        email: email.value,
        contact: contact.value
    }
    if(!stdObj.fName ||!stdObj.regNo ||!stdObj.email ||!stdObj.contact) return snackbar('Fill form properly','warning')

    showSpinner()
    fetch(STD_URL,{ method:"POST", body:JSON.stringify(stdObj), headers:{ "Content-type":"application/json" }})
.then(res=>res.json())
.then(data=>{
        stdObj.id = data.name
        state.stdArr.unshift(stdObj)

        let tr = document.createElement('tr')
        tr.id = stdObj.id
        tr.innerHTML = `
                <td>${stdObj.fName}</td>
                <td>${stdObj.regNo}</td>
                <td>${stdObj.email}</td>
                <td>${stdObj.contact}</td>
                <td><i onclick="editStd(this)" class="btn btn-outline-success">Edit</i></td>
                <td><i onclick="deleteStd(this)" class="btn btn-outline-danger">Remove</i></td>
            `
        stList.prepend(tr)
        stdForm.reset()
        snackbar('Student added successfully','success')
    })
.catch(err=>cl(err))
.finally(()=>hideSpinner())
}

//Delete-std
function deleteStd(ele){
    let REMOVE_ID = ele.closest('tr').id
    let REMOVE_URL = `${BASE_URL}students/${REMOVE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this student!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner()
            fetch(REMOVE_URL, { method: "DELETE" })
          .then(res => {
                if(!res.ok) throw new Error('Failed to delete')
                return res.json()
            })
          .then(() => {
                state.stdArr = state.stdArr.filter(s => s.id!== REMOVE_ID);
                ele.closest('tr').remove();
                snackbar('Student deleted successfully!', 'success')
            })
          .catch(err => {
                cl(err)
                snackbar('Failed to delete', 'error')
            })
          .finally(() => hideSpinner())
        }
    })
}

//edit-std
function editStd(ele){
    let editId = ele.closest('tr').id
    state.editId = editId
    let EDIT_URL = `${BASE_URL}students/${editId}.json`
    showSpinner()
    fetch(EDIT_URL)
.then(res=>res.json())
.then(data=>{
        fName.value = data.fName
        regNo.value = data.regNo
        email.value = data.email
        contact.value = data.contact
        submitBtn.classList.add('d-none')
        updateBtn.classList.remove('d-none')
    })
.catch(err=>cl(err))
.finally(()=>hideSpinner())
}

//update-std
function onUpdateStd(eve){
    if(eve) eve.preventDefault()
    let update_Id = state.editId
    let UPDATE_URL = `${BASE_URL}students/${update_Id}.json`
    let updateObj = {
        fName: fName.value,
        regNo: regNo.value,
        email: email.value,
        contact: contact.value,
        id: update_Id
    }

    showSpinner()
    fetch(UPDATE_URL,{ method:"PATCH", body:JSON.stringify(updateObj), headers:{ "Content-type":"application/json" }})
.then(()=>{
        let getIndex = state.stdArr.findIndex(s=>s.id === update_Id)
        state.stdArr[getIndex] = updateObj
        let tr = document.getElementById(update_Id)

        tr.innerHTML = `
            <td>${updateObj.fName}</td>
            <td>${updateObj.regNo}</td>
            <td>${updateObj.email}</td>
            <td>${updateObj.contact}</td>
            <td><i onclick="editStd(this)" class="btn btn-outline-success">Edit</i></td>
            <td><i onclick="deleteStd(this)" class="btn btn-outline-danger">Remove</i></td>
        `
        stdForm.reset()
        submitBtn.classList.remove('d-none')
        updateBtn.classList.add('d-none')
        snackbar('Updated','success')
    })
.catch(err=>cl(err))
.finally(()=>hideSpinner())
}

stdForm.addEventListener('submit', onStdAdd)
updateBtn.addEventListener('click', onUpdateStd)