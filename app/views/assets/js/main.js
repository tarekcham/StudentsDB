 filterRows => (data) {
 $('tbody').empty();
    $.each(data, function( index, student ) {
     
     let subjects = '';
     $.each(student.subjects, function(i,s) {
         subjects += `<button id="subjectButton" class="btn btn-sm btn-outline-info">${s}</button> `;
       });

      $('tbody').append(`<tr><th scope="row">${index+1}</th><td>${student.name}</td><td id="studentAge">${student.age}</td>
       <td id="studentGender">${student.gender}</td><td>${student._id}</td>
       <td>${subjects}
       <td><button class="btn btn-sm btn-outline-secondary edit" data-id="${student._id}">edit</button>
       <button class="btn btn-sm btn-outline-danger remove" data-id="${student._id}">delete</button></td></tr>`);
    });
    console.log("Loading completed");
}



function updateView(){
  // Load default
  $.ajax({
    url: "api/students"
  }).done(((data) => {
    console.log(data);
    filterRows(data)
    
  }));
}

$(document).ready(() => {
  updateView();
});


// Delete a user event
$(document).on("click", "button.remove" , function() {
  const studentId = $(this).attr("data-id");
  $.ajax({
      url: '/api/student/'+studentId,
      type: 'DELETE'
  }).done(((data) => { 
    updateView();
    console.log("deleted");
  }));
});

// Edit a user event
$(document).on("click", "button.edit" , function() {
  const studentId = $(this).attr("data-id");
  $.ajax({
      url: '/api/student/'+studentId
  })
  .done(((student) => { 
    $('#theModal').modal('show');
    $('#newStudent input[name=name]').val(student.name);
    $('#newStudent input[name=age]').val(student.age);
    $('#newStudent input[name=subjects]').val(student.subjects.join(' '));
    $(`#newStudent input[name=gender][value="${student.gender}"]`).prop('checked', true);
    $('#newStudent input[name=studentId]').val(student._id);
  }));

});

$(document).on("click", "button.new" , function() {
  $('#theModal').modal('show');
  //to avoid overwriting we force this empty
  $('#newStudent input[name=studentId]').val('');
});

$(document).on("click", "button.find" , function(event) {
  event.preventDefault();

    let studentId = $('#searchVal').val();
  $.ajax({
      url: '/api/student/'+studentId
  })
    .done((student) => {
     $('tbody').empty();
   

      $('tbody').append(`<tr><th scope="row">1</th><td>${student.name}</td><td>${student.age}</td>
       <td>${student.gender}</td><td>${student._id}</td>
       <td>${student.subjects}
       <td><button class="btn btn-sm btn-outline-secondary edit" data-id="${student._id}">edit</button>
       <button class="btn btn-sm btn-outline-danger remove" data-id="${student._id}">delete</button></td></tr>`);
    })
   
  });


$(document).on("click", "#subjectButton" , function(event) {
  event.preventDefault();

    let studentSubject = $(this).text();

    console.log(studentSubject);
  $.ajax({
      url: '/api/subjects/'+studentSubject
  })
    .done((students) => {
      

     filterRows(students);

     })
   
  });

$(document).on("click", "#studentGender" , function(event) {
  event.preventDefault();

    let studentGender = $(this).text();

    console.log(studentGender);
  $.ajax({
      url: '/api/genders/'+studentGender
  })
    .done((students) => {
      

     filterRows(students);

     })
    
  });





$(document).on("click", "#studentAge" , function(event) {
  event.preventDefault();

    let studentAge = $(this).text();

    console.log(studentAge);
  $.ajax({
      url: '/api/age/'+studentAge
  })
    .done((students) => {
      console.log(students);
      

     filterRows(students);

     })
    console.log("Loading completed");
  });





$(document).on("click", "button.find" , function(event) {
  event.preventDefault();

    let studentId = $('#searchVal').val();
  $.ajax({
      url: '/api/student/'+studentId
  })
    .done((student) => {
     $('tbody').empty();
   

      $('tbody').append(`<tr><th scope="row">1</th><td>${student.name}</td><td>${student.age}</td>
       <td>${student.gender}</td><td>${student._id}</td>
       <td>${student.subjects}
       <td><button class="btn btn-sm btn-outline-secondary edit" data-id="${student._id}">edit</button>
       <button class="btn btn-sm btn-outline-danger remove" data-id="${student._id}">delete</button></td></tr>`);
    })
    console.log("Loading completed");
  });



$(document).on("keyup", "input[name=subjects]" , function() {
  var subjectsCapitalize = $('#newStudent input[name=subjects]').val();
  $('#newStudent input[name=subjects]').val(subjectsCapitalize.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); }));
});

$('#newStudent').on("submit", function(event) {
  event.preventDefault();
  $('#theModal').modal('hide');

  const subjects = $('#newStudent input[name=subjects]').val();
  const subjectsArr = subjects.split(",");
  const studentId = $('#newStudent input[name=studentId]').val();

  const gender = $('input[name=gender]:checked').val();

  if(studentId === ''){

    $.ajax({
        url: '/api/student/',
        type: 'POST',
        dataType : 'json',
        contentType : "application/json",
        data: JSON.stringify({
          name: $('#newStudent input[name=name]').val(), 
          age: $('#newStudent input[name=age]').val(),
          gender: gender,
          subjects: subjectsArr
        })
    })
    .done((() => { 
      updateView();
    }));

  } else {

    $.ajax({
        url: '/api/student/'+studentId,
        type: 'PUT',
        dataType : 'json',
        contentType : "application/json",
        data: JSON.stringify({
          name: $('#newStudent input[name=name]').val(), 
          age: $('#newStudent input[name=age]').val(),
          gender: gender,
          subjects: subjectsArr
        })
    })
    .done((() => { 
      updateView();
    }));
  }
});

$(document).ready(function() {
    //set initial state.
    $('input[name=gender]').change(function() {
      console.log("changed: "+ $('input[name=gender]:checked').val());   
      console.log("try: "+ $('input[name=gender]:checked').prop("value"));       
    });
});