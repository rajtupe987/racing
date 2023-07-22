/**
* @swagger
* components:
*   schemas:
*       User:
*           type: object
*           required:
*              - name
*              - email
*              - pass
*           properties:
*               name:
*                   type: string
*                   description: username of the user
*               email:
*                   type: string
*                   description: The user email
*               pass:
*                   type: string
*                   description: The user password
*               role:
*                   type: string
*                   description: Role of a user 
*               approved:
*                   type: boolean
*                   description: If a user is approved by the admin to become a photographer or not
*               camera:
*                   type: string
*                   description: Camera used by the photographer
*               expertise:
*                   type: string
*                   description: Photographer expert in types of shots 
*               address:
*                   type: string
*                   description: Location where a user wants to do PhotoShoot 
*               samplePics:
*                   type: [string]
*                   description: If user wants to become a photographer then he needs to give sample pics for approval
*/
