Option Explicit

Dim oFSO, oShell, sScriptPath, sFolderPath, sFilePath

' Create a File System Object
Set oFSO = CreateObject("Scripting.FileSystemObject")

' Create a Shell object
Set oShell = CreateObject("WScript.Shell")

' Get the full path of the VBScript
sScriptPath = WScript.ScriptFullName

' Get the parent folder of the VBScript
sFolderPath = oFSO.GetParentFolderName(sScriptPath)

' Get the path to the batch file
sFilePath = sFolderPath & "\startServer.bat"

' Check if the batch file exists
If oFSO.FileExists(sFilePath) Then
  ' Execute the batch file
  oShell.Run sFilePath, 0, False
End If

' Release objects from memory
Set oFSO = Nothing
Set oShell = Nothing
