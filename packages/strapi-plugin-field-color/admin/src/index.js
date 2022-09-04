import { prefixPluginTranslations } from '@strapi/helper-plugin'
import * as yup from 'yup'
import ColorPickerIcon from './components/ColorPicker/ColorPickerIcon'
import pluginId from './pluginId'

export default {
  register(app) {
    app.customFields.register({
      name: 'color',
      pluginId,
      type: 'string',
      icon: ColorPickerIcon,
      intlLabel: {
        id: 'field-color.color.label',
        defaultMessage: 'Color',
      },
      intlDescription: {
        id: 'field-color.color.description',
        defaultMessage: 'Select any color',
      },
      components: {
        Input: async () => import(/* webpackChunkName: "input-component" */ './components/ColorPicker/ColorPickerInput'),
      },
      options: {
        base: [
          {
            intlLabel: {
              id: 'color-picker.color.format.label',
              defaultMessage: 'Color format',
            },
            name: 'options.format',
            type: 'select',
            value: 'hex',
            options: [
              {
                key: '__null_reset_value__',
                value: '',
                metadatas: {
                  intlLabel: {
                    id: 'color-picker.color.format.placeholder',
                    defaultMessage: 'Select a format',
                  },
                  hidden: true,
                },
              },
              {
                key: 'hex',
                value: 'hex',
                metadatas: {
                  intlLabel: {
                    id: 'color-picker.color.format.hex',
                    defaultMessage: 'Hexadecimal',
                  },
                },
              },
              {
                key: 'rgba',
                value: 'rgba',
                metadatas: {
                  intlLabel: {
                    id: 'color-picker.color.format.rgba',
                    defaultMessage: 'RGBA',
                  },
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.privateField',
                  defaultMessage: 'Private field',
                },
                description: {
                  id: 'form.attribute.item.privateField.description',
                  defaultMessage: 'This field will not show up in the API response',
                },
              },
              {
                name: 'unique',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.uniqueField',
                  defaultMessage: 'Unique field',
                },
                description: {
                  id: 'form.attribute.item.uniqueField.description',
                  defaultMessage: "You won't be able to create an entry if there is an existing entry with identical content",
                },
              },
            ],
          },
        ],
        validator: () => ({
          format: yup.string().required({
            id: 'options.color-picker.format.error',
            defaultMessage: 'The color format is required',
          }),
        }),
      },
    })
  },
  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            }
          })
          .catch(() => {
            return {
              data: {},
              locale,
            }
          })
      }),
    )

    return Promise.resolve(importedTrads)
  },
}
