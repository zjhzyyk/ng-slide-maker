'use strict';

angular.module('slidesGeneratorApp')
  .value('uiTinymceConfig', {
    plugins: ["advlist autolink autoresize contextmenu link lists paste searchreplace table textcolor"],
    toolbar: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect forecolor backcolor | bullist numlist outdent indent | link",
    menubar: false,
    fontsize_formats: "15pt 20pt 30pt 40pt 50pt 90pt 170pt",
    statusbar: false,
    inline: true
  })
  .directive('uiTinymce', ['uiTinymceConfig', '$document', 'slides', 'canvas', function (uiTinymceConfig, $document, slides, canvas) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    var prex, prey, c, inmove = false;
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var expression, options, tinyInstance, state;
        var EDIT_MODE = 0;
        var MOVE_MODE = 1;
        var IDLE_MODE = 2;
        // state = IDLE_MODE;
        // generate an ID if not present
        c = slides.getSlideById(scope.slide.index).components[scope.component.id];
        function mousemove(e){
          inmove = true;
          e.preventDefault();
          e.stopPropagation();
          c.x += (e.screenX-prex) / canvas.getCanvasScale();
          c.y += (e.screenY-prey) / canvas.getCanvasScale();
          elm.parent()[0].style.left = c.x+'px';
          elm.parent()[0].style.top = c.y+'px';
          prex = e.screenX;
          prey = e.screenY;
        }
        function mouseup(e) {
          e.preventDefault();
          e.stopPropagation();
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
        if (!attrs.id) {
          attrs.$set('id', 'uiTinymce' + generatedIds++);
        }
        options = {
          // Update model when calling setContent (such as from the source editor popup)
          setup: function (ed) {
            ed.on('init', function(args) {
              ngModel.$render();
              elm.blur();
              ed.state = IDLE_MODE;
            });
            // Update model on button click
            ed.on('ExecCommand', function (e) {
              // ed.save();
              ngModel.$setViewValue(elm.val());
              if (!scope.$$phase) {
                scope.$apply();
              }
            });
            // Update model on keypress
            ed.on('KeyUp', function (e) {
              // console.log(ed.isDirty());
              // ed.save();
              ngModel.$setViewValue(elm.val());
              if (!scope.$$phase) {
                scope.$apply();
              }
            });
            ed.on('mousedown', function(e){
              e.preventDefault();
              e.stopPropagation();
              if (ed.state===MOVE_MODE) {
                inmove = false;
                prex = e.screenX;
                prey = e.screenY;
                c.x = parseFloat(elm.parent().css("left"));
                c.y = parseFloat(elm.parent().css("top"));
                $document.bind('mousemove', mousemove);
                $document.bind('mouseup', mouseup);
              }
            });
            ed.on('mouseup', function(){
              if (ed.state===IDLE_MODE) {
                ed.state = MOVE_MODE; 
                var ednum = tinymce.editors.length;
                for (var ei = 0; ei<ednum; ei++) {
                  document.getElementById(tinymce.editors[ei].id).style.border = "none";
                  tinymce.editors[ei].state = IDLE_MODE;
                }
                $(".icon-resize-horizontal").each(function(){
                  this.style.display = "none";
                });
                tinymce.activeEditor.fire("blur");
                ed.state = MOVE_MODE;
                // elm.blur();
                elm[0].style.border = "1px #318BFF solid";
                elm.parent().children(".icon-resize-horizontal").show();
              }
              else if (inmove===false && ed.state===MOVE_MODE) {
                ed.state = EDIT_MODE;
                elm[0].style.border = "none";
                elm.parent().children(".icon-resize-horizontal").hide();
                ed.focus();
              }
            });
            ed.on('blur', function(){
              ed.state = IDLE_MODE;
              elm.blur();
            });
          },
          mode: 'exact',
          elements: attrs.id
        };
        if (attrs.uiTinymce) {
          expression = scope.$eval(attrs.uiTinymce);
        } else {
          expression = {};
        }
        angular.extend(options, uiTinymceConfig, expression);
        // setTimeout(function () {
          tinymce.init(options);
        // });

        // $timeout(function(){
        //   elm.blur();
        //   // $document.focus();
        // }, 1000);

        ngModel.$render = function() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id);
          }
          if (tinyInstance) {
            tinyInstance.setContent(ngModel.$viewValue || 'Please input');
          }
        };
      }
    };
  }]);
