The overview of custom functions we have used in our application. You can find the `plpgsql` script for them in  `/database/seeders/init.sql` file. Here's a simple text based explanation of the same.

# Terminologies
1. CREATE OR REPLACE FUNCTION - If function does not exist, it creates a new one otherwise overwrites the same function
2. current_setting - Gives you current values of setting in your postgres DB.
3. STRICT - Asks to return only one row from the query otherwise throw TOO_MANY_ROWS exception.
4. VOLATILE - A function which can modify the DB.
5. COST - Cost defines expected arbitrary units of computations to execute the query or function.
6. TRIGGERS - Triggers are hooks that can trigger after insert, update or deletion of each row.
7. NEW - NEW represents new row we wants to insert. Already available in trigger
8. OLD - OLD represents old row we we have at the moment & wants to update. Already available in trigger

# Functions
## Function -> `__current_user`
> Functionality:  Obtain the current user in our DB.

```
This function will return integer

Initialize UserID as -1

Now Search for username currently set in our DB (In current_setting('postgres.username'))
    If found
        Return it as final value of this function

In case there are (Too Many Rows) or (Returned Value is Undefined) or (Data Is Not Found)
    Then return the id from our users table where username is 'default';
```

## Function -> `set_modified_by_user_at_date`
> Functionality: This function is like an activity log for each table

```
This function will return trigger

Set modified_date column in current row to Current UTC Date.

Set modified_by column to the id we get from the __current_user function.
```

## Function -> `set_deleted_by_user_at_date`
> Functionality: Soft delete a row

```
This function will return trigger

If value of deleted column do not match in new row & old row & new row has its value as true
   	Set deleted_date column in current row to Current UTC Date.
    Set deleted_by column to the id we get from the __current_user function.
```

## Function -> `enforce_secure_pwd_storage`
> Functionality: Hash the password

> Prerequisite:
```
CREATE EXTENSION pgcrypto;

This extension will give us the crypt method to be used in hashing
```

```
This function will return trigger

if password is null or empty on a new row
    Then generate a random uuid & hash it using *Blowfish* algorithm 
    (This password would be of no use since we also do not know what was hashed).

if password is not null
    Then we simply hash the row's haspass field using *Blowfish* algorithm.
```

## Trigger -> `users_enforce_secure_pwd_storage`
> Functionality: Apply the hash password trigger to users table

```
We simply restrict the trigger of enforce_secure_pwd_storage
only to INSERT OR UPDATE OF hashpass on users table.
```

## Function -> `db_auto_schema_update`
> Functionality: Migration tracker & executor

```
This function will return boolean

We declare some variables with their data type
rec
error
errorMsg
results
rowCount

We create a temporary table based from our existing *database_updates* table
  where the rows are in *pending* status (Means they are yet to run) & 
  script name should be greater than the last executed *successful* 
  script row (We have script name for migration files prefixed with timestamp).
  These rows are fetched in the ascending order of *script_name* column

We will get an array of records from previous query (Can be empty too)

Now we iterate over this records array
  & we execute the script stored in *script_sql* column of each record
  If we find any error 
    We console the error message &
    We update its status as *failed* in the table &
    We stop the execution of this function
  If it is success
    We console the success message &
    We update its status as *successful* in the table &
    Move on to the next record
```