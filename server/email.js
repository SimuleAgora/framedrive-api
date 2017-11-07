var nodemailer = require('nodemailer');
require('./config/config');

var transport = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'contato@framedrive.com',
      pass: 'ericorocha'
    } 
});

var getTemplate = (template, params) => {
    return new Promise((res, rej) => {
        var response = {};
        switch (template) {
            case 'newClient':
                //param[0] = studio, param[1] = project.title, param[2] = userID do cliente do fotógrafo
                response.subject = params[0] + ', enviou um convite para seleção das fotos do evento ' + params[1];
                response.body = "Não perca tempo, selecione agora mesmo as fotos do evento <a href='" + process.env.BASE_URL + "selection/newUser/" + params[2] + "'>clique aqui</a> "
                break;
            default:
                rej('switch 404 template');
                break;
        }
        res(response);
    });
}

var sendEmail = (to, template, params) => {
  
   return new Promise((res, rej) => {
             getTemplate(template, params).then((message) => {
transport.sendMail({
                from: 'contato@framedrive.com',
                to: to,
                subject: message.subject,
                html: message.body
            }, function(err) {
                if (err)
                    console.log(err);
                rej(err);
            });
            console.log('ok');
            res('ok');
            });
            
        });
}
module.exports = {sendEmail}