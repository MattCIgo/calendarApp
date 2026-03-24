from django.contrib import admin
from . import models

class UserNoteAdmin(admin.ModelAdmin):
  readonly_fields = ('date_created', 'note_id')

class UserAdmin(admin.ModelAdmin):
  readonly_fields = ('user_id', )

admin.site.register(models.UserNote, UserNoteAdmin)
admin.site.register(models.User, UserAdmin)