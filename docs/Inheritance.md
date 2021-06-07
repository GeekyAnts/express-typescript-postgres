Since Postgres in an RDBMS which supports some object oriented feature. We leveraged inheritance in this repository
> These tables are for inheritance use only. They are not intended to contain their own data

# Inherited Tables

## 1. __creation_log
| Column           | DataType     |
| :--------------: | :----------: |
| created_by       | Integer      |
| created_date     | TimeStamp    |


## 2. __modification_log
| Column           | DataType     |
| :--------------: | :----------: |
| modified_by       | Integer      |
| modified_date     | TimeStamp    |

## 3. __deletion_log
| Column           | DataType     |
| :--------------: | :----------: |
| deleted          | Boolean      |
| deleted_by       | Integer      |
| deleted_date     | TimeStamp    |

<br>

> Any table inheriting these tables will have these column added to them
   
