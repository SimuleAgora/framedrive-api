var mongoose = require('mongoose');

var ProjectSchema =  new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Aprovado','Aguardando Seleção'],
    lowercase: true,
    trim: true
  },
  folders:[{
    folderAbove: {
      type: String
    },
    name: {
      type:String,
      trim: true,
      lowercase: true
    },
    folderEncoded: {
      type: String,
      lowercase: true,
      trim: true
    },

    _createdAt: {
      type: String
    }
  }
  ],
  photos:[
  {
     
      folder: {
        type: String,
      },
      type: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ['thumbnail','photo'],
      },
      link: {
        type: String,
        minlength: 1,
        lowercase: true,
        trim: true,
        lowercase: true
      },
      _createdAt: {

          type: String
      },
      id: { type: String },
      name: { type: String },
      bucket: { type: String },
      size: { type: String },
      selfLink: { type: String },
      mediaLink: { type: String }
  }
  ],
  eventDate: {  
      type: String
  },
  _createdAt: {  
      type: String
  },
  _updatedAt: {
      type: String
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

ProjectSchema.statics.findProject = function(userId, projectId) {
  return new Promise((res,rej) => {
       //console.log('Init find proj');
        Project.findOne({
            _id: projectId,
            _creator: userId
          },{__v:0,_creator:0,_createdAt:0}
      ).then((project) => {
        if (!project) {
          rej(404);
        }
          //console.log('finished find proj');
          res({project: {_id:project._id, title:project.title, category:project.category, eventDate:project.eventDate, _updatedAt:project._updatedAt},folders:project.folders, photos:project.photos});
      }).catch((e) => {
        //console.log(e);
        rej(400);
      });
    });
}

ProjectSchema.statics.findFolders = function(userId, projectId) {
  return new Promise((res,rej) => {
      Project.findOne({
      _id: projectId,
      _creator: userId 
    },{folders:1, _id:0}
    ).then((project) => {
      if (!project) {
        //rej(404);
      }
        ////console.log('finished find folders');
        final = []; 
         //project.folders.forEach((item) => { if(item.path.length == 1) { final.push(item); } });
      res({folders: final, root: {}});
    }).catch((e) => {
      //console.log(e);
      //rej(400);
    });
  });
}

ProjectSchema.statics.getFolders = function(projectFolders, folderAboveId) {
  //console.log('Init find folders');
  return new Promise((res,rej) => {
    var folders = [];
    if(projectFolders === undefined || projectFolders.length === 0)
      res({folders});
    projectFolders.forEach((folder) => { 
      if(folder.folderAbove === folderAboveId)
        folders.push(folder);
    });   
      //console.log('finished find folders');
 
    res({folders});
  });
}

ProjectSchema.statics.getPhotos = function(projectPhotos, folderId) {
    //console.log('Init find photos');
  return new Promise((res,rej) => {
    //console.log(projectPhotos);
    var photos = [];
    if(projectPhotos === undefined || projectPhotos.length === 0){
      //console.log('finished find photos');
      res({photos});
    }
    projectPhotos.forEach((photo) => { 
      if(photo.folder === folderId)
        photos.push(photo);
    }); 
    //console.log('finished find photos');  
    res(photos);
  });
}

ProjectSchema.statics.getFolder = function(userId, projectId,folderId) {
  return new Promise((res,rej) => {
    Project.findOne({
       _id: projectId,
       "folders._id": folderId,
        _creator: userId
    }, {
        "folders.$": 1,
        _id: 0
    }).then((project) => {
        if (!project) {
            rej(404);
        }

        res({
            path: project.folders[0].path,
            rootFolder: project.folders[0],
            status: 200
        });

    }).catch((e) => {
        //console.log(e);
        rej(400);
  });
  });
}


var Project = mongoose.model('Project', ProjectSchema);
module.exports = {Project};