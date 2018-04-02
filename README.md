

* [Auth](#auth-routes)
* [User](#user-routes)
* [Skills](#skills-routes)
* [Employee](#employee-routes)
* [Emloyer](#employer-routes)
* [Company](#company-routes)
* [Ask](#ask-routes)
* [Bid](#bid-routes)
* [Message](#message-routes)

# Auth routes
**POST** `/api/auth/login`

String: **username**

String **password**

    { 
	    "token": "auth token string" 
    }


----------


**POST** `/api/auth/register`

* String **username**
* String **password**
* String **email**
* Number **status** - 0 - freelancer / 1 - employer


	    { 
		    "token": "auth token string" 
	    }
    
	
**OR** if error

    { 
	    "message": "reason" 
    }
    
    
----------
**POST** `/api/auth/check-email`
> Checks if email is available 
String **email**

    { 
	    "success": "good" 
    }
    
**OR** if error

    { 
	    "message": "Email already registered" 
    }

----------
**POST** `/api/auth/check-username`
> Checks if user name is available 

String: **username**


    { 
	    "success": "good" 
    }
    
**OR** if error

    { 
	    "message": "Name already in use" 
    }

----------

**GET** `/api/auth/id`

> Auth header required

    {
		"user_id": "5a9df8f1d1db7a0b3c98a713"
	}


----------


# User routes
> Auth header required in all routes

**GET** `/api/user/all`

    [
        {
            "username": "niko1",
	    "_id": "5aaada4043fb9a3e9c0aab06",
	    "image": "5aaada4043fb9a3e9c0aab06.jpg",
            "email": "some@ema2il.com",
            "city": "Sepolno3",
            "phone": "555983212",
            "last_name": "French2",
            "first_name": "English1",
            "status": 0
        },
        {
            "**username**": "niko",
            "email": "some@ema2il.com"
			"status": "-1"
        },
        {
            "**username**": "niko23",
            "email": "some@ema2il.com"
			"status": "-1"
        }
    ]


----------


**GET** 
* `/api/user/:id` 
* `/api/user/me`

> If user is of status 0 - employee data will be added, status 1 - empoyer data will be added

**:id** - id of user to GET - **me** stands for logged in user
> Example of status 0

	 {
		    "user": {
			"create_date": [],
			"_id": "5aaad2641752053ae942d328",
			"username": "msz64",
			"email": "msz64@wp.pl",
			"status": 0,
			"city": "Duza Cerkwica",
			"phone": "123456789",
			"last_name": "Szczu",
			"first_name": "Miko",
			"unread_messages": 1
			"image": "5aaad2641752053ae942d328.png"
		    },
		    "rate": 0,
		    "employee": {
			"bids": [
			    "5aac0bbdf96d920dba28946b",
			    "5ab160b8f69d91293866456c",
			    "5ab16625afd7722fb8494777",
			    "5ab1663fafd7722fb8494778",
			    "5ab16642afd7722fb8494779",
			    "5ab16659afd7722fb849477a",
			    "5ab16660afd7722fb849477b"
			],
			"languages": [
			    {
				"name": "Spanish"
			    }
			],
			"software": [
			    {
				"name": "Microsoft World"
			    }
			],
			"specs": [
			    {
				"name": "Angular 2"
			    }
			],
			"certifications": [
			    {
				"name": "CISCO2"
			    }
			],
			"categories": [
			    {
				"name": "Android developer"
			    }
			],
			"_id": "5aaad2761752053ae942d329",
			"finished_asks": 1,
			"in_progress_asks": 1,
			"waiting_asks": 5
		    }
	    }

> Example of status 1

	    {
		    "user": {
			"create_date": [],
			"_id": "5aaada4043fb9a3e9c0aab06",
			"username": "qwe",
			"email": "qwe@wp.pl",
			"status": 1,
			"city": "Gch",
			"phone": "321321321",
			"last_name": "Pracodawca",
			"first_name": "Jakis ",
			"unread_messages": 0
			"image": "5aaada4043fb9a3e9c0aab06.png"
		    },
		    "rate": 0,
		    "employer": {
			"asks": [
			    "5aaadac043fb9a3e9c0aab0a",
			    "5aac0ebbf96d920dba28946c",
			    "5ab144dff69d912938664525",
			    "5ab145c9f69d91293866452c"
			],
			"company": [
			    "5aaada7e43fb9a3e9c0aab09"
			],
			"_id": "5aaada5c43fb9a3e9c0aab08",
			"active_asks": 4,
			"finished_asks": 1,
			"in_progress_asks": 0
		    }
	    }


> rate is the average of all rates


----------

**GET** `/api/user/:id/rates`
> **Resturns** All rates of a user.

* **:id** - id of a user to get rates from (path property)
* **pagesize** - number of rates to return - **defuault 10**
* **page** - number of the page of rates - **default 0**

		{
		    "rates": [
		        {
		            "grade": 4,
		            "description": "good",
		            "user_to": "5aaac7e584b8179c8a320ae7",
		            "user_from": {
		                "_id": "5aaad2641752053ae942d328",
		                "username": "janek",
		                "last_name": "Kowalski",
		                "first_name": "Jan"
		            }
		        },
		        {
		            "grade": 2,
		            "description": "not that good",
		            "user_to": "5aaac7e584b8179c8a320ae7",
		            "user_from": {
		                "_id": "5aaada4043fb9a3e9c0aab06",
		                "username": "meme",
		                "last_name": "Skoczek",
		                "first_name": "Krzysztof "
		            }
		        }
		    ],
		    "count": 2
		}
> **count** - is number of all available rates

----------
**POST** `/api/user/rate`
> Adds rate or updates previous rate
* String **description**
* Number **grade**
* String(id) **user_to** - id of a user to rate

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
**POST** `/api/user/update`
> Updates user, password included
* String **first_name**
* String **last_name**
* String **password**
* String **email**
* String **phone**
* String **city** 

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
**POST** `/api/user/image/upload`
> Save a user profile file and update property image of user to file name

* Multipart file: **file** - only png & jpg
 
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
**DELETE** `/api/user/image/remove`
> Removes user image
 
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
**GET** `/image/user/:img`

**:img** - name and extension of image to get, user property **image** cointains that value

> **Returns** profile image of a user
----------
# Skills routes
> Auth header required in all routes

**GET** 
* `/api/skills/categories`
* `/api/skills/languages` 
* `/api/skills/software` 
* `/api/skills/specializations` 
* `/api/skills/certifications`

certifications doesn't have level property - all the rest is the same languages example

    [
	    {
	        "name": "Spanish"
			"level": "B"
	    },
	    {
	        "name": "English"
	    },
	    {
	        "name": "French"
	    },
	    {
	        "name": "Italian"
	    }
	]


----------


# Employee routes


> Auth header required in all routes

**POST** `/api/employee/create`

* String **first_name**

* String **last_name**

* String **phone**

* String **city**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
	
----------
**POST** `/api/employee/update`

* String **description**
* String **portfolio_link**
* String **git_link**
* String **linked_in_link**
* Number **salary**
* String **education**
* Array[String] **categories** 
* Array[String] **languages** 
* Array[String] **software**
* Array[String] **specs**
* Array[String] **certifications**

>Example array would be { languages: ['English', 'Spanish'] }


> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
	
----------



# Employer routes
> Auth header required in all routes

**POST** `/api/employer/create`

* String **first_name**

* String **last_name**

* String **phone**

* String **city**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
	
----------

**POST** `/api/employer/update`

* String **git_link**
* String **linked_in_link**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON

----------

**GET**
*  `/api/employer/asks/my` - returns all asks of logged user
*  `/api/employer/asks/:id` - returns all asks of employer with given id

**:id** - id of a employer to get asks from.

    
    [
		    {
		        "bids": [5aa80434696ead16a3deb1cb, 5aa80434696ead16a3deb1cc],
		        "is_active": true,
		        "is_complete": false,
		        "creation_date": "2018-03-13T18:03:18.306Z",
		        "languages": [],
		        "software": [],
		        "specs": [],
		        "certifications": [],
		        "categories": [],
		        "_id": "5aa814425367262b5634bd33",
		        "description": "opis",
		        "salary": 1500,
		        "work_time": 12,
		        "employer": "5aa7f6fc696ead16a3deb1c8",
		    },
		    {
		        "bids": [],
		        "is_active": true,
		        "is_complete": false,
		        "creation_date": "2018-03-13T18:03:18.306Z",
		        "languages": [],
		        "software": [],
		        "specs": [],
		        "certifications": [],
		        "categories": [
		            {
		                "name": "Android developer"
		            },
		            {
		                "name": "Web developer"
		            }
		        ],
		        "_id": "5aa816115367262b5634bd34",
		        "description": "opis",
		        "salary": 1500,
		        "work_time": 12,
		        "employer": "5aa7f6fc696ead16a3deb1c8",
		    }
    ]


----------  

**GET**  
* `/api/employer/companies/my` - returns all companies of logged user.
* `/api/employer/companies/:id` - returns all companies of employer with given id

 **:id** - id of employer to get companies from.

	    [
		    {
		        "_id": "5aa80434696ead16a3deb1cb",
		        "employer": "5aa7f6fc696ead16a3deb1c8",
		        "name": "firma1",
		        "NIP": "123",
		        "city": "dc",
		    }
	    ]


----------


# Company routes
> Auth header required in all routes

**POST** `/api/company/create`

* String **name**
* String **NIP** > UNIQUE - if duplicate returns **message**
* String **city**

    
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON

----------
**POST** `/api/company/update/:id`

* **:id** - id of company to update
* String **name**
* String **NIP** 
* String **city**

   
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
**DELETE** `/api/company/delete/:id`

* **:id** - id of company to delete
* String **NIP**
    
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON

----------
**GET**  `/api/company/:id`
* **:id** - id of company to get.

	    {
		    "_id": "5aa80434696ead16a3deb1cb",
		    "employer": "5aa7f6fc696ead16a3deb1c8",
		    "name": "firma1",
		    "NIP": "123",
		    "city": "dc",
	    }

----------

# Ask routes
> Auth header required in all routes

**GET** `/api/ask/all`

> Filter is implemented

* Array[String]/String **categories** 
* Array[String]/String **languages**
* Array[String]/String **software**
* Array[String]/String **specs**
* Array[String]/String **certifications**
* Number **pagesize** - default 10
* Number **page** - default 0

	    {
		    "count": 1,
		    "asks": [
			{
			    "bids": 1,
			    "is_active": true,
			    "is_complete": false,
			    "creation_date": "3/15/2018, 21:35:59",
			    "languages": [
				{
				    "name": "Spanish"
				}
			    ],
			    "software": [
				{
				    "name": "Microsoft World"
				}
			    ],
			    "specs": [
				{
				    "name": "C++"
				}
			    ],
			    "certifications": [
				{
				    "name": "CISCO1"
				},
				{
				    "name": "CISCO2"
				}
			    ],
			    "categories": [
				{
				    "name": "Android developer"
				},
				{
				    "name": "Front-end developer"
				}
			    ],
			    "_id": "5aaadac043fb9a3e9c0aab0a",
			    "title": "Ogloszenie 1",
			    "description": "ogloszenie 1",
			    "salary": 1500,
			    "work_time": 12,
			    "employer": {
				"_id": "5aa7f6fc696ead16a3deb1c8",
				"user_id": "5aa7f6e9696ead16a3deb1c6",
			    },
			}
		    ]
	    }

> count is a maximum size of avaiable asks with given filter - **not the count of returned items**

----------

**GET** `/api/ask/:id`
* **:id** - id of ask to show
> Example route `/api/ask/5aaadac043fb9a3e9c0aab0a`

	{
	    "ask": {
		"is_active": true,
		"is_complete": false,
		"create_date": "3/15/2018, 21:35:59",
		"languages": [
		    {
			"name": "Spanish"
		    }
		],
		"software": [
		    {
			"name": "Eclipse"
		    }
		],
		"specs": [
		    {
			"name": "Java"
		    }
		],
		"certifications": [
		    {
			"name": "CISCO1"
		    }
		],
		"categories": [
		    {
			"name": "Android developer"
		    }
		],
		"_id": "5aaadac043fb9a3e9c0aab0a",
		"title": "Ogloszenie 1",
		"description": "Super ogloszenie nr 1",
		"salary": 123,
		"work_time": 12,
		"employer": {
		    "_id": "5aaada5c43fb9a3e9c0aab08",
		    "user_id": "5aaada4043fb9a3e9c0aab06"
		},
	    },
	    "bids": [
		{
		    "create_date": "3/16/2018, 18:53:46",
		    "is_accepted": false,
		    "_id": "5aac0bbdf96d920dba28946b",
		    "description": "no elo biore ta oferte",
		    "salary": 2115,
		    "employee": {
			"_id": "5aaad2761752053ae942d329",
			"user_id": "5aaad2641752053ae942d328"
		    },
		    "ask": "5aaadac043fb9a3e9c0aab0a",
		    "__v": 0
		}
	    ]
	}


----------
**POST** `/api/ask/create`
* String **title** (required)
* String **description**
* Number **salary**
* Number **work_time**
* Array[String] **categories** 
* Array[String] **languages**
* Array[String] **software**
* Array[String] **specs**
* Array[String] **certifications**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON


----------
**POST** `/api/ask/update/:id`
* **:id** - id of ask to update
* String **title**
* String **description**
* Number **salary**
* Number **work_time**
* Array[String] **categories** 
* Array[String] **languages**
* Array[String] **software**
* Array[String] **specs**
* Array[String] **certifications**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
**DELETE** `/api/ask/delete/:id`

* **:id** - id of ask to remove

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
# Bid routes
> Auth header required in all routes

**POST** `/api/bid/create/:id`

* **:id** - id of ask to bid to
* String **description**
* Number **salary**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON

----------
**POST** `/api/bid/accept/:id`

* **:id** - id of bid to accept

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
# Message routes
> Auth header required in all routes

**POST** `/api/message/send`

* String **content** - content of the message
* String **to** - id of a user to send message to

	    {
		    "success": "Message sent",
		    "message": {
			"content": "Nie wierze w to gowno zjebane ",
			"send_date": "3/20/2018, 22:27:22",
			"is_read": false,
			"_id": "5ab17cba9b9c085b1b313a04",
			"is_send": true
		    }
	    }
		 
> **Returns** message if error;
----------
**GET** `/api/messages/all`
> **Returns** all of logged user latest messages 

* **pagesize** - number of messages to get (get param) - **default 10**
* **page** - number of page/offset (get param) - **default 0**

		 {
		    "messages": [
			{
			    "_id": "5aaac7e584b8179c8a320ae7",
			    "content": "friends?",
			    "send_date": "3/18/2018, 15:05:39",
			    "is_read": false,
			    "is_send": true,
			    "username": "emp",
			    "first_name": "Niko",
			    "last_name": "qwe"
			},
			{
			    "_id": "5aaad2641752053ae942d328",
			    "content": "I may be sick but i'm not",
			    "send_date": "3/18/2018, 15:02:12",
			    "is_read": false,
			    "is_send": false,
			    "username": "msz64",
			    "first_name": "Mikolaj",
			    "last_name": "Szczubial"
			}
		    ],
		    "count": 4
		}

> **_id** is a id of a user with these message is with
	
> **count** is a maximum size of avaiable asks with given filter - **not the count of returned items**
----------    
**GET** `/api/message/with/:id`
> **Resturns** messages between logged user and given one. Newest ones are at the bottom.

* **:id** - id of a user with whom logged user is corresponding (path param)
* **pagesize** - number of messages to get (get param) - **default 10**
* **page** - number of page/offset (get param) - **default 0**

	    {
		    "with": {
			"_id": "5aaada4043fb9a3e9c0aab06",
			"username": "qwe",
			"last_name": "Pracodawca",
			"first_name": "Jakis "
		    },
		    "messages": [
			{
			    "send_date": "3/20/2018, 19:19:29",
			    "is_read": true,
			    "_id": "5ab150b1d6f4bd53e781ee99",
			    "content": "oh mate",
			    "is_send": false
			},
			{
			    "send_date": "3/20/2018, 19:19:32",
			    "is_read": true,
			    "_id": "5ab150b4d6f4bd53e781ee9a",
			    "content": "am done",
			    "is_send": false
			},
			{
			    "send_date": "3/20/2018, 19:19:34",
			    "is_read": false,
			    "_id": "5ab150b6d6f4bd53e781ee9b",
			    "content": "em",
			    "is_send": true
			},
			{
			    "send_date": "3/20/2018, 19:19:37",
			    "is_read": false,
			    "_id": "5ab150b9d6f4bd53e781ee9c",
			    "content": "is anyone there?",
			    "is_send": true
			}
		    ],
		    "count": 4
	    }
> **count** is a maximum size of avaiable asks with given filter - **not the count of returned items**
> **is_send** tells whether message was received or sent.
