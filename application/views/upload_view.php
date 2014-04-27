<?php if (!empty($success)) echo '<h3>File successfully uploaded.</h3>'?>
<?php if (!empty($error)) echo $error;?>

<?php echo form_open_multipart(base_url() . 'upload/'); ?>
<input type="file" name="userfile" size="20" />

<input type="submit" name="upload" value="Upload" />
<?php echo form_close(); ?>
