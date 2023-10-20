export const indexTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frontend_for_test</title>
  <script src="/static/client.js" type="application/javascript"></script>
</head>

<body>
  <div id="react_root">${content}</div>
  <div id="modal-form_root"></div>
  <div id="modal-edit-form_root"></div>
  <div id="modal-product-form_root"></div>
  <div id="modal-print_root"></div>
</body>

</html>
`;
