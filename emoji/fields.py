from django.db.models import TextField
from django.forms import Textarea


class EmojiTextAreaWidget(Textarea):
    class Media:
        css = {
            'all': ('emoji/css/emoji.css',)
        }
        js = ('emoji/js/emoji.js', 'emoji/js/emoji_widget.js')


class EmojiTextField(TextField):
    def formfield(self, **kwargs):
        defaults = {'widget': EmojiTextAreaWidget}

        defaults.update(kwargs)
        return super(EmojiTextField, self).formfield(**defaults)
