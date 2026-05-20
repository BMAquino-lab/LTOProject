#CREATE AN sql_linker.py USING THIS FORMAT
#CREATE IT USING THE EXACT FILE NAME IN THIS FOLDER
#PARA GUMANA YUNG .gitignore

#this manages the link between python and mariadb

import pymysql
import threading

class SQLLinker:
    def __init__(self):
      self.user = "YOUR USERNAME" #this is the -u part in mysql prompt on terminal
      self.password = "YOUR PASSWORD" #this is the -p part in mysql prompt on terminal
      self.database = "LTO"
      self.host = "127.0.0.1"
      self._local = threading.local()

    def _connect(self):
       return pymysql.connect(
              user=self.user,
              password=self.password,
              database=self.database,
              host=self.host,
              cursorclass=pymysql.cursors.DictCursor,
              autocommit=False
          )
    
    def _connection(self):
       conn = getattr(self._local, "conn", None)
       if conn is None:
          conn = self._connect()
          self._local.conn = conn
          return conn

       try:
          conn.ping(reconnect=True)
       except pymysql.Error:
          conn = self._connect()
          self._local.conn = conn

       return conn

    def cur(self) -> pymysql.cursors.Cursor:
       return self._connection().cursor()

    def close(self):
       conn = getattr(self._local, "conn", None)
       if conn is not None:
          conn.close()
          self._local.conn = None
    
    #to really save the changes
    def commit(self):
       self._connection().commit()
    #for undo just in case
    def rollback(self):
       self._connection().rollback()
         
         
