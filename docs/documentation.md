# API Documentation

This project will allow authorized users to Create, Read, Update, or Delete cool project ideas. Currently, there is no front end tied to this API, so any request must be made with cUrl or similar.

## Structural Information

### Object Structure

All \<PROJECT_PARAMS\> are formatted as such:

```
{
  name: 'Some name',
  description: 'Some description of the project',
  tags: ['category one', 'category two', ...],
}
```

Projects will then be given a unique identifier.

### Work Flow

In order to delete or update a project, you need access to its ID first. To retrieve this, make a call to the read all endpoint and find the project you're looking for. You will see the ID field, and be able to use that in the delete and update endpoints.

## Available Endpoints

### Create a new project

Endpoint:
`http://api/projects/create/<PROJECT_PARAMS>`

Result:
`{success: True}` or `{success: False}`

### Read data on all projects

Endpoint:
`http://api/projects/`

Result:

```
[
  {
    id: 0,
    name: 'Fun Project',
    description: 'This project is so fun!',
    tags: ['frontend', 'fun'],
  },
  {
    id: 1,
    name: 'Cool project',
    description: 'This project is so cool!',
    tags: ['flask', 'backend']
  },
  ...
]

```

### Update the information on a project

Endpoint:
`http://api/projects/update/id=<PROJECT_ID>/<PROJECT_PARAMS>`

Result:

```
{
  previous: {
    name: 'Random Project',
    description: 'This project is so random!',
    tags: ['random', 'cool', 'databases'],
  },
  new: {
    name: 'New Name',
    description: 'This project is so new!',
    tags: ['beast', 'updated', 'new'],
  }
}

```

### Delete the information on a project

Endpoint:
`http://api/projects/delete/id=<PROJECT_ID>`

Result:

```
{
  name: 'Deleted Project',
  description: 'This project is so random!',
  tags: ['random', 'cool', 'databases'],
}

```
