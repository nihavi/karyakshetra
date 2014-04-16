<?php
    $this->load->helper('url');
?><!DOCTYPE html>
<html>
<head>
    <title>Karyakshetra | Dash</title>
</head>
<body>
<?php foreach ($files as $file): ?>
<div>
    <a href="<?php echo base_url() . $file['module'] . '/' . $file['id'] ?>/"><?php echo $file['name']; ?></a>
</div>
<?php endforeach; ?>
</body>
</html>
