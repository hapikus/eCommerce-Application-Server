const option = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-com API',
      version: '1.0.0',
      description: 'This is CRUD API made with Express and documented with Swagger'
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'development server',
      },
      {
        url: 'https://codefrondlers.store/api',
        description: 'production server',
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName', 'birthday'],
          properties: {
            email: {
              type: 'string',
              unique: true,
              description: 'User email address',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            isActivated: {
              type: 'boolean',
              default: false,
              description: 'Flag indicating whether the user account is activated',
            },
            activationLink: {
              type: 'string',
              description: 'Activation link for the user account',
            },
            billingAddress: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/BillingAddress',
              },
              description: 'Array of billing addresses associated with the user',
            },
            shippingAddress: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ShippingAddress',
              },
              description: 'Array of shipping addresses associated with the user',
            },
            orders: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Order',
              },
              description: 'Array of orders placed by the user',
            },
            birthday: {
              type: 'date',
              description: "User's date of birth",
            },
          },
        },
        BillingAddress: {
          type: 'object',
          required: ['country', 'city', 'street', 'postalCode'],
          properties: {
            country: {
              type: 'string',
              description: 'Country of the billing address',
            },
            city: {
              type: 'string',
              description: 'City of the billing address',
            },
            street: {
              type: 'string',
              description: 'Street of the billing address',
            },
            postalCode: {
              type: 'string',
              description: 'Postal code of the billing address',
            },
            isDefault: {
              type: 'boolean',
              default: false,
              description: 'Flag indicating whether this is the default billing address',
            },
          },
        },
        ShippingAddress: {
          type: 'object',
          required: ['country', 'city', 'street', 'postalCode'],
          properties: {
            country: {
              type: 'string',
              description: 'Country of the shipping address',
            },
            city: {
              type: 'string',
              description: 'City of the shipping address',
            },
            street: {
              type: 'string',
              description: 'Street of the shipping address',
            },
            postalCode: {
              type: 'string',
              description: 'Postal code of the shipping address',
            },
            isDefault: {
              type: 'boolean',
              default: false,
              description: 'Flag indicating whether this is the default shipping address',
            },
          },
        },
        Order: {
          type: 'object',
        },
        Product: {
          type: 'object',
          properties: {
            gameTitle: {
              type: 'string',
              required: true,
            },
            headerImg: {
              type: 'string',
            },
            screenshotList: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            userReviewRows: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ReviewSummary: {
                    type: 'string',
                  },
                  ResponsiveHidden: {
                    type: 'string',
                  },
                },
              },
            },
            price: {
              type: 'number',
            },
            discountPrice: {
              type: 'number',
            },
            releaseDate: {
              type: 'string',
            },
            devCompany: {
              type: 'string',
            },
            descriptionShort: {
              type: 'string',
            },
            descriptionLong: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            category: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            sysRequirementsMinimum: {
              type: 'object',
              properties: {
                OS: { type: 'string' },
                Processor: { type: 'string' },
                Memory: { type: 'string' },
                Graphics: { type: 'string' },
                DirectX: { type: 'string' },
                Network: { type: 'string' },
                Storage: { type: 'string' },
                VRSupport: { type: 'string' },
              },
            },
            sysRequirementsMinimumFill: {
              type: 'object',
              properties: {
                OS: { type: 'string' },
                Processor: { type: 'string' },
                Memory: { type: 'string' },
                Graphics: { type: 'string' },
                DirectX: { type: 'string' },
                Network: { type: 'string' },
                Storage: { type: 'string' },
              },
            },
            sysRequirementsRecommended: {
              type: 'object',
              properties: {
                OS: { type: 'string' },
                Processor: { type: 'string' },
                Memory: { type: 'string' },
                Graphics: { type: 'string' },
                DirectX: { type: 'string' },
                Network: { type: 'string' },
                Storage: { type: 'string' },
              },
            },
          },
        },
        UserDto: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'User email address',
            },
            id: {
              type: 'string',
              description: 'ID from user schema',
            },
            isActivated: {
              type: 'string',
              description: 'Flag indicating whether the user account is activated',
            },
          }
        }
      },
    },
  },
  apis: ['./router/index.js']
}

module.exports = option;
