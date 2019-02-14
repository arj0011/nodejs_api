"use strinct";

const dateTime = require('date-time'),
	  uniqid   = require('uniqid');

var appConstant = function(){
  /* Site Details */
	this.site_name      = "My Site";
	this.base_url       = "http://localhost:3000/";
	this.image_url       = "http://localhost:3000/images/";
	this.from_email     = "arjun.choudhary@tekzee.com";
	this.smtp_username  = "arjun.choudhary@tekzee.com";
	this.smtp_password  = "*******";
	this.temp_code      = Math.floor(100000 + Math.random() * 900000); // 6 digit
	this.code_valid_time   = 15; // In minutes
	this.resend_code_limit = 5; // In minutes
	this.session_limit     = 6; // In hours

	

	/* Default Messages */
	this.general_error = 'Some error occured, please try again.';
	this.invalid_login_session_key = 'Invalid user login session key.';
	this.invalid_code = 'Invalid user verification code.';
	this.invalid_forgot_code = 'Invalid forgot password code.';
	this.user_detais_not_found = 'User details not found.';
	this.already_verified = 'Your account is already verified.';
	this.email_verify  = 'Currently your profile is not verified, please verfiy your email id.';
	this.user_blocked  = 'Your profile has been blocked. Please contact to our support team.';
	this.user_deactivated  = 'Currently your profile is deactivated. Please contact to our support team.';
	this.session_expired   = 'Your session has expired, please login again.';
	this.code_limit_msg    = 'Sorry !! your temporary code has been expired.';
	this.forgot_pswd_msg   = 'A temporary code has sent on your registered email id, please check your mailbox.';
	this.verification_subject   = '['+this.site_name + '] verify account';
	this.forgot_password_subject   = '['+this.site_name + '] forgot password';

	/* Datetime */
	this.current_time      = dateTime({local: false,date: new Date()});
	this.current_timestamp = new Date().getTime();

	/* Upload Files */
	this.file_upload_path  = __dirname + '/uploads/';
	this.random_image_name = 'user-'+ uniqid.time() + '-' + new Date().getTime();
  
  /* Database Constants */
  	this.users        = 'users';
  	this.category     = 'category';
  	this.product      = 'product';

  /* Site Options */
	this.gallery_image_limit = 3;
	this.min_age_limit       = 16;
	this.session_limit = 6; // hours

  	return this;
}  

module.exports = new appConstant();